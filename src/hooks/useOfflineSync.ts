import { useState, useEffect } from 'react';
import { offlineSyncManager } from '@/utils/offlineSync';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updateStatus = () => {
      setIsOnline(offlineSyncManager.isOnline());
      setPendingCount(offlineSyncManager.getPendingSyncCount());
    };

    // Initial update
    updateStatus();

    // Subscribe to changes
    const unsubscribe = offlineSyncManager.addListener(updateStatus);

    return () => {
      unsubscribe();
    };
  }, []);

  const queueOperation = async (
    operation: 'INSERT' | 'UPDATE' | 'DELETE',
    tableName: string,
    recordData: any
  ) => {
    await offlineSyncManager.queueOfflineOperation(operation, tableName, recordData);
    setPendingCount(offlineSyncManager.getPendingSyncCount());
  };

  const syncNow = async () => {
    await offlineSyncManager.syncOfflineData();
    setPendingCount(offlineSyncManager.getPendingSyncCount());
  };

  return {
    isOnline,
    pendingCount,
    queueOperation,
    syncNow,
  };
};
