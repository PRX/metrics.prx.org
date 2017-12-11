export type MetricsType = 'downloads' | 'geo' | 'userAgents';

export interface PodcastMetricsModel {
  seriesId: number;
  feederId?: string;
  charted?: boolean;
  monthlyDownloads?: any[][];
  weeklyDownloads?: any[][];
  dailyDownloads?: any[][];
  hourlyDownloads?: any[][];
}

export interface EpisodeMetricsModel {
  seriesId: number;
  id: number;
  guid?: string;
  page?: number;
  charted?: boolean;
  monthlyDownloads?: any[][];
  weeklyDownloads?: any[][];
  dailyDownloads?: any[][];
  hourlyDownloads?: any[][];
}
