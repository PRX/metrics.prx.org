export interface PodcastMetrics {
  id: string;
  monthlyReach?: any[][];
  weeklyReach?: any[][];
  dailyReach?: any[][];
  hourlyReach?: any[][];
  charted?: boolean;
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}
