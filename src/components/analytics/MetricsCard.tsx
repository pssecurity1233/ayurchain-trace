import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const MetricsCard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  description,
  trend,
  className
}: MetricsCardProps) => {
  const getTrendIcon = () => {
    if (trend === 'up' || (change && change > 0)) return ArrowUp;
    if (trend === 'down' || (change && change < 0)) return ArrowDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (trend === 'up' || (change && change > 0)) return 'text-green-600';
    if (trend === 'down' || (change && change < 0)) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const TrendIcon = getTrendIcon();
  const trendColor = getTrendColor();

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {(change !== undefined || changeLabel) && (
          <div className={cn("flex items-center text-xs mt-2", trendColor)}>
            <TrendIcon className="h-3 w-3 mr-1" />
            <span className="font-medium">
              {change !== undefined && `${Math.abs(change)}%`}
              {changeLabel && ` ${changeLabel}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
