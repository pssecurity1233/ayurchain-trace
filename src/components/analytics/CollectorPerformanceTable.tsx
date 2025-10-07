import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface CollectorStats {
  id: string;
  name: string;
  totalCollections: number;
  totalQuantityKg: number;
  qualityScore: number;
  complianceScore: number;
  rank: number;
}

interface CollectorPerformanceTableProps {
  collectors: CollectorStats[];
  title?: string;
  description?: string;
  showRankIcons?: boolean;
}

type SortKey = keyof CollectorStats;

export const CollectorPerformanceTable = ({
  collectors,
  title = "Collector Performance",
  description = "Top performing collectors ranked by harvest volume",
  showRankIcons = true
}: CollectorPerformanceTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedCollectors = [...collectors].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return 0;
  });

  const getRankIcon = (rank: number) => {
    if (!showRankIcons || rank > 3) return null;
    
    const icons = {
      1: <Trophy className="h-5 w-5 text-yellow-500" />,
      2: <Medal className="h-5 w-5 text-gray-400" />,
      3: <Award className="h-5 w-5 text-amber-600" />
    };
    
    return icons[rank as keyof typeof icons];
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-600">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-600">Good</Badge>;
    return <Badge variant="secondary">Fair</Badge>;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const SortableHeader = ({ label, sortKey: key }: { label: string; sortKey: SortKey }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 font-medium"
      onClick={() => handleSort(key)}
    >
      {label}
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">
                <SortableHeader label="Rank" sortKey="rank" />
              </TableHead>
              <TableHead>
                <SortableHeader label="Collector" sortKey="name" />
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader label="Collections" sortKey="totalCollections" />
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader label="Volume (kg)" sortKey="totalQuantityKg" />
              </TableHead>
              <TableHead className="text-center">
                <SortableHeader label="Quality" sortKey="qualityScore" />
              </TableHead>
              <TableHead className="text-center">
                <SortableHeader label="Compliance" sortKey="complianceScore" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCollectors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No collector data available
                </TableCell>
              </TableRow>
            ) : (
              sortedCollectors.map((collector) => (
                <TableRow key={collector.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRankIcon(collector.rank)}
                      <span className="font-medium">#{collector.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(collector.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{collector.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{collector.totalCollections}</TableCell>
                  <TableCell className="text-right font-medium">
                    {collector.totalQuantityKg.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getScoreBadge(collector.qualityScore)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{collector.complianceScore.toFixed(0)}%</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
