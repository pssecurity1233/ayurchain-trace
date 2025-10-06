import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, MapPin, Calendar, FileText } from 'lucide-react';
import GeoFenceManager from '@/components/GeoFenceManager';
import SeasonWindowManager from '@/components/SeasonWindowManager';
import ExportCertificationManager from '@/components/ExportCertificationManager';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('geofences');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            System Configuration
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage geo-fences, harvest seasons, and export certifications
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="geofences" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Geo-Fences
            </TabsTrigger>
            <TabsTrigger value="seasons" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Season Windows
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Export Certifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="geofences">
            <GeoFenceManager />
          </TabsContent>

          <TabsContent value="seasons">
            <SeasonWindowManager />
          </TabsContent>

          <TabsContent value="certifications">
            <ExportCertificationManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
