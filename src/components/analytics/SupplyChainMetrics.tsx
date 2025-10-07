import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SupplyChainData {
  avgCollectionToBatchHours: number;
  avgBatchProcessingHours: number;
  avgTotalProcessingHours: number;
  traceabilityCoverage: number;
  batchCompletionRate: number;
  bottlenecks?: string[];
}

interface SupplyChainMetricsProps {
  data: SupplyChainData;
  period?: string;
  className?: string;
}

export const SupplyChainMetrics = ({
  data,
  period = "Last 30 days",
  className
}: SupplyChainMetricsProps) => {
  const formatHours = (hours: number) => {
    if (hours < 24) return `${hours.toFixed(1)}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours.toFixed(0)}h`;
  };

  const getEfficiencyColor = (hours: number) => {
    if (hours <= 24) return "text-green-600";
    if (hours <= 72) return "text-yellow-600";
    return "text-red-600";
  };

  const getTraceabilityColor = (coverage: number) => {
    if (coverage >= 90) return "text-green-600";
    if (coverage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Supply Chain Efficiency
        </CardTitle>
        <CardDescription>{period}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Processing Time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Collection → Batch</span>
            </div>
            <p className={`text-2xl font-bold ${getEfficiencyColor(data.avgCollectionToBatchHours)}`}>
              {formatHours(data.avgCollectionToBatchHours)}
            </p>
            <p className="text-xs text-muted-foreground">Average time</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Batch Processing</span>
            </div>
            <p className={`text-2xl font-bold ${getEfficiencyColor(data.avgBatchProcessingHours)}`}>
              {formatHours(data.avgBatchProcessingHours)}
            </p>
            <p className="text-xs text-muted-foreground">Average time</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">End-to-End</span>
            </div>
            <p className={`text-2xl font-bold ${getEfficiencyColor(data.avgTotalProcessingHours)}`}>
              {formatHours(data.avgTotalProcessingHours)}
            </p>
            <p className="text-xs text-muted-foreground">Total time</p>
          </div>
        </div>

        {/* Traceability Coverage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Traceability Coverage</span>
            </div>
            <span className={`text-sm font-bold ${getTraceabilityColor(data.traceabilityCoverage)}`}>
              {data.traceabilityCoverage.toFixed(1)}%
            </span>
          </div>
          <Progress value={data.traceabilityCoverage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Batches with complete traceability records
          </p>
        </div>

        {/* Batch Completion Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Batch Completion Rate</span>
            </div>
            <span className="text-sm font-bold">{data.batchCompletionRate.toFixed(1)}%</span>
          </div>
          <Progress value={data.batchCompletionRate} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Batches successfully finalized
          </p>
        </div>

        {/* Bottlenecks */}
        {data.bottlenecks && data.bottlenecks.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Identified Bottlenecks</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.bottlenecks.map((bottleneck, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {bottleneck}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
