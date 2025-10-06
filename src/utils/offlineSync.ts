import { supabase } from '@/integrations/supabase/client';

export interface OfflineRecord {
  id: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  table_name: string;
  record_data: any;
  timestamp: number;
}

const OFFLINE_STORAGE_KEY = 'ayurchain_offline_queue';

export class OfflineSyncManager {
  private static instance: OfflineSyncManager;
  private syncInProgress = false;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    // Register service worker
    this.registerServiceWorker();
    
    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  static getInstance(): OfflineSyncManager {
    if (!OfflineSyncManager.instance) {
      OfflineSyncManager.instance = new OfflineSyncManager();
    }
    return OfflineSyncManager.instance;
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
          await Notification.requestPermission();
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  private handleOnline() {
    console.log('Connection restored - syncing offline data...');
    this.syncOfflineData();
    this.notifyListeners();
  }

  private handleOffline() {
    console.log('Connection lost - offline mode activated');
    this.notifyListeners();
  }

  addListener(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  async queueOfflineOperation(
    operation: 'INSERT' | 'UPDATE' | 'DELETE',
    tableName: string,
    recordData: any
  ): Promise<void> {
    const record: OfflineRecord = {
      id: crypto.randomUUID(),
      operation,
      table_name: tableName,
      record_data: recordData,
      timestamp: Date.now(),
    };

    const queue = this.getOfflineQueue();
    queue.push(record);
    this.saveOfflineQueue(queue);

    console.log('Operation queued for offline sync:', record);

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.syncOfflineData();
    }
  }

  private getOfflineQueue(): OfflineRecord[] {
    try {
      const data = localStorage.getItem(OFFLINE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveOfflineQueue(queue: OfflineRecord[]): void {
    try {
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  getPendingSyncCount(): number {
    return this.getOfflineQueue().length;
  }

  async syncOfflineData(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) {
      return;
    }

    this.syncInProgress = true;
    const queue = this.getOfflineQueue();

    if (queue.length === 0) {
      this.syncInProgress = false;
      return;
    }

    console.log(`Syncing ${queue.length} offline operations...`);

    const successfulSyncs: string[] = [];
    const failedSyncs: OfflineRecord[] = [];

    for (const record of queue) {
      try {
        await this.syncRecord(record);
        successfulSyncs.push(record.id);
        console.log('Synced record:', record.id);
      } catch (error) {
        console.error('Failed to sync record:', record.id, error);
        failedSyncs.push(record);
      }
    }

    // Update queue with failed syncs only
    this.saveOfflineQueue(failedSyncs);
    this.syncInProgress = false;
    this.notifyListeners();

    if (successfulSyncs.length > 0) {
      this.showNotification(
        'Sync Complete',
        `Successfully synced ${successfulSyncs.length} operations`
      );
    }

    if (failedSyncs.length > 0) {
      this.showNotification(
        'Sync Warning',
        `${failedSyncs.length} operations failed to sync`
      );
    }
  }

  private async syncRecord(record: OfflineRecord): Promise<void> {
    const { operation, table_name, record_data } = record;

    // Save to server's offline_sync_queue for processing
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase.from('offline_sync_queue').insert({
      user_id: user.id,
      operation,
      table_name,
      record_data,
      sync_status: 'pending',
    } as any);

    if (error) throw error;
  }

  private showNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/placeholder.svg',
        badge: '/placeholder.svg',
      });
    }
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  async requestPersistentStorage(): Promise<boolean> {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      const isPersisted = await navigator.storage.persist();
      console.log(`Persistent storage ${isPersisted ? 'granted' : 'denied'}`);
      return isPersisted;
    }
    return false;
  }
}

// Export singleton instance
export const offlineSyncManager = OfflineSyncManager.getInstance();
