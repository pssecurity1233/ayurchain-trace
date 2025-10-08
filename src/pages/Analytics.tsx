import { useState } from "react";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { DateRangeSelector } from "@/components/analytics/DateRangeSelector";
import { MetricsCard } from "@/components/analytics/MetricsCard";
import { HarvestVolumeChart } from "@/components/analytics/HarvestVolumeChart";
import { QualityTrendsChart } from "@/components/analytics/QualityTrendsChart";
import { SupplyChainMetrics } from "@/components/analytics/SupplyChainMetrics";
import { CollectorPerformanceTable } from "@/components/analytics/CollectorPerformanceTable";
import { ConservationImpactCard } from "@/components/analytics/ConservationImpactCard";
import { Package, TrendingUp, CheckCircle, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useHarvestVolumeAnalytics,
  useQualityTrends,
  useSupplyChainEfficiency,
  useCollectorPerformance,
  useConservationMetrics,
} from "@/hooks/useAnalytics";

const Analytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data: harvestData } = useHarvestVolumeAnalytics(dateRange);
  const { data: qualityData } = useQualityTrends(dateRange);
  const { data: supplyChainData } = useSupplyChainEfficiency();
  const { data: collectorData } = useCollectorPerformance();
  const { data: conservationData } = useConservationMetrics();

  const totalHarvest = Array.isArray(harvestData) ? harvestData.reduce((sum: number, item: any) => sum + parseFloat(item.total_quantity || 0), 0) : 0;
  const avgQuality = Array.isArray(qualityData) && qualityData.length > 0 ? qualityData.reduce((sum: number, item: any) => sum + (item.avg_quality_score || 0), 0) / qualityData.length : 0;
  const activeCollectors = Array.isArray(collectorData) ? collectorData.length : 0;

  const harvestChartData = Array.isArray(harvestData) ? harvestData.map((item: any) => ({
    date: item.collection_date,
    volume: parseFloat(item.total_quantity || 0),
    species: item.species_id,
  })) : [];

  const qualityChartData = Array.isArray(qualityData) ? qualityData.map((item: any) => ({
    date: item.test_date,
    passRate: item.pass_rate || 0,
    avgScore: item.avg_quality_score || 0,
    totalTests: item.total_tests || 0,
  })) : [];

  const conservationMetrics = Array.isArray(conservationData) && conservationData[0] ? {
    sustainableHarvestPercentage: parseFloat(conservationData[0].sustainable_harvest_pct || 0),
    protectedSpeciesCompliance: parseFloat(conservationData[0].protected_species_compliance || 0),
    seasonalComplianceRate: parseFloat(conservationData[0].seasonal_compliance_rate || 0),
    biodiversityScore: parseFloat(conservationData[0].biodiversity_score || 0),
  } : {
    sustainableHarvestPercentage: 0,
    protectedSpeciesCompliance: 0,
    seasonalComplianceRate: 0,
    biodiversityScore: 0,
  };

  const supplyChainMetrics = Array.isArray(supplyChainData) && supplyChainData[0] ? {
    avgCollectionToBatchHours: parseFloat(supplyChainData[0].avg_collection_to_batch_hours || 0),
    avgBatchProcessingHours: parseFloat(supplyChainData[0].avg_batch_processing_hours || 0),
    avgTotalProcessingHours: parseFloat(supplyChainData[0].avg_total_processing_hours || 0),
    traceabilityCoverage: parseFloat(supplyChainData[0].traceability_coverage || 0),
    batchCompletionRate: parseFloat(supplyChainData[0].batch_completion_rate || 0),
  } : {
    avgCollectionToBatchHours: 0,
    avgBatchProcessingHours: 0,
    avgTotalProcessingHours: 0,
    traceabilityCoverage: 0,
    batchCompletionRate: 0,
  };

  const collectorPerformanceData = Array.isArray(collectorData) ? collectorData.map((item: any, index: number) => ({
    id: item.collector_id,
    name: item.collector_name || 'Unknown',
    totalCollections: item.total_collections || 0,
    totalQuantityKg: parseFloat(item.total_quantity_kg || 0),
    qualityScore: parseFloat(item.avg_quality_score || 0),
    sustainabilityScore: parseFloat(item.sustainability_score || 0),
    complianceScore: parseFloat(item.compliance_score || 0),
    rank: index + 1,
    lastCollection: item.last_collection_date,
  })) : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
        </div>
        <DateRangeSelector dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Total Harvest"
          value={`${totalHarvest.toFixed(2)} kg`}
          icon={Package}
          trend="up"
          change={12.5}
          changeLabel="vs last period"
        />
        <MetricsCard
          title="Quality Score"
          value={avgQuality.toFixed(1)}
          icon={CheckCircle}
          trend="up"
          change={5.2}
          changeLabel="vs last period"
        />
        <MetricsCard
          title="Active Collectors"
          value={activeCollectors}
          icon={Users}
          description="Currently active"
        />
        <MetricsCard
          title="Supply Chain Efficiency"
          value={`${supplyChainMetrics.traceabilityCoverage.toFixed(1)}%`}
          icon={TrendingUp}
          trend="up"
          change={3.1}
          changeLabel="traceability"
        />
      </div>

      <Tabs defaultValue="harvest" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="harvest">Harvest</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
          <TabsTrigger value="collectors">Collectors</TabsTrigger>
          <TabsTrigger value="conservation">Conservation</TabsTrigger>
        </TabsList>

        <TabsContent value="harvest" className="space-y-4">
          <HarvestVolumeChart data={harvestChartData} />
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <QualityTrendsChart trendData={qualityChartData} />
        </TabsContent>

        <TabsContent value="supply-chain" className="space-y-4">
          <SupplyChainMetrics data={supplyChainMetrics} />
        </TabsContent>

        <TabsContent value="collectors" className="space-y-4">
          <CollectorPerformanceTable collectors={collectorPerformanceData} />
        </TabsContent>

        <TabsContent value="conservation" className="space-y-4">
          <ConservationImpactCard metrics={conservationMetrics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
