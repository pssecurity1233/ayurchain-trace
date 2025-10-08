import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export const useHarvestVolumeAnalytics = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ["harvest-volume", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("calculate_harvest_volume_by_species" as any, {
        start_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : null,
        end_date: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : null,
      });
      if (error) throw error;
      return data as any[];
    },
    refetchInterval: 30000,
  });
};

export const useConservationMetrics = (collectorId?: string) => {
  return useQuery({
    queryKey: ["conservation-metrics", collectorId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("calculate_conservation_impact" as any, {
        p_collector_id: collectorId,
      });
      if (error) throw error;
      return data as any[];
    },
    refetchInterval: 30000,
  });
};

export const useSupplyChainEfficiency = () => {
  return useQuery({
    queryKey: ["supply-chain-efficiency"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("calculate_supply_chain_efficiency" as any);
      if (error) throw error;
      return data as any[];
    },
    refetchInterval: 30000,
  });
};

export const useQualityTrends = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ["quality-trends", dateRange],
    queryFn: async () => {
      let query = supabase.from("quality_trends" as any).select("*");
      
      if (dateRange?.from) {
        query = query.gte("test_date", format(dateRange.from, "yyyy-MM-dd"));
      }
      if (dateRange?.to) {
        query = query.lte("test_date", format(dateRange.to, "yyyy-MM-dd"));
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as any[];
    },
    refetchInterval: 30000,
  });
};

export const useCollectorPerformance = () => {
  return useQuery({
    queryKey: ["collector-performance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collector_performance" as any)
        .select("*")
        .order("total_collections", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as any[];
    },
    refetchInterval: 30000,
  });
};

export const useSpeciesAnalytics = () => {
  return useQuery({
    queryKey: ["species-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("species_analytics" as any)
        .select("*")
        .order("total_quantity_kg", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    refetchInterval: 30000,
  });
};

export const useGeographicDistribution = () => {
  return useQuery({
    queryKey: ["geographic-distribution"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("geographic_distribution" as any)
        .select("*");
      if (error) throw error;
      return data as any[];
    },
    refetchInterval: 30000,
  });
};
