import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Leaf, Shield, TreePine, MapPin } from "lucide-react";

interface ConservationMetrics {
  sustainableHarvestPercentage: number;
  protectedSpeciesCompliance: number;
  seasonalComplianceRate: number;
  biodiversityScore: number;
  carbonFootprintKg?: number;
  geographicDiversityIndex?: number;
}

interface ConservationImpactCardProps {
  metrics: ConservationMetrics;
  collectorName?: string;
  period?: string;
  className?: string;
}

export const ConservationImpactCard = ({
  metrics,
  collectorName,
  period = "Last 30 days",
  className
}: ConservationImpactCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const overallScore = (
    metrics.sustainableHarvestPercentage * 0.3 +
    metrics.protectedSpeciesCompliance * 0.3 +
    metrics.seasonalComplianceRate * 0.2 +
    metrics.biodiversityScore * 0.2
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Conservation Impact
            </CardTitle>
            <CardDescription>
              {collectorName && `${collectorName} • `}{period}
            </CardDescription>
          </div>
          <Badge variant={overallScore >= 80 ? "default" : "secondary"} className="text-lg px-4 py-2">
            {overallScore.toFixed(0)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Sustainability</span>
            <span className="text-sm text-muted-foreground">{getScoreLabel(overallScore)}</span>
          </div>
          <Progress value={overallScore} className="h-3" />
        </div>

        {/* Sustainable Harvest */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TreePine className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Sustainable Harvest</span>
            </div>
            <span className="text-sm font-bold">{metrics.sustainableHarvestPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={metrics.sustainableHarvestPercentage} className="h-2" />
        </div>

        {/* Protected Species Compliance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Protected Species Compliance</span>
            </div>
            <span className="text-sm font-bold">{metrics.protectedSpeciesCompliance.toFixed(1)}%</span>
          </div>
          <Progress value={metrics.protectedSpeciesCompliance} className="h-2" />
        </div>

        {/* Seasonal Compliance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium">Seasonal Compliance</span>
            </div>
            <span className="text-sm font-bold">{metrics.seasonalComplianceRate.toFixed(1)}%</span>
          </div>
          <Progress value={metrics.seasonalComplianceRate} className="h-2" />
        </div>

        {/* Biodiversity Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Biodiversity Impact</span>
            </div>
            <span className="text-sm font-bold">{metrics.biodiversityScore.toFixed(1)}</span>
          </div>
          <Progress value={metrics.biodiversityScore} className="h-2" />
        </div>

        {/* Additional Metrics */}
        {(metrics.carbonFootprintKg || metrics.geographicDiversityIndex) && (
          <div className="pt-4 border-t grid grid-cols-2 gap-4">
            {metrics.carbonFootprintKg && (
              <div>
                <p className="text-xs text-muted-foreground">Carbon Footprint</p>
                <p className="text-lg font-bold">{metrics.carbonFootprintKg.toFixed(2)} kg</p>
              </div>
            )}
            {metrics.geographicDiversityIndex && (
              <div>
                <p className="text-xs text-muted-foreground">Geographic Diversity</p>
                <p className="text-lg font-bold">{metrics.geographicDiversityIndex.toFixed(2)}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
