export type MetricsType = 'downloads' | 'geo' | 'userAgents';

export interface PodcastMetricsModel {
  seriesId: number;
  feederId: string;
  monthlyDownloads?: any[][];
  weeklyDownloads?: any[][];
  dailyDownloads?: any[][];
  hourlyDownloads?: any[][];
}

export interface EpisodeMetricsModel {
  seriesId: number;
  id: number;
  guid: string;
  page: number;
  monthlyDownloads?: any[][];
  weeklyDownloads?: any[][];
  dailyDownloads?: any[][];
  hourlyDownloads?: any[][];
}
