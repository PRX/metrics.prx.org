export interface IntervalModel {
  value: string;
  name: string;
  key: string;
}

export const INTERVAL_DAILY: IntervalModel = { value: '1d', name: 'daily', key: 'daily' };
export const INTERVAL_HOURLY: IntervalModel = { value: '1h', name: 'hourly', key: 'hourly' };
export const INTERVAL_15MIN: IntervalModel = { value: '15m', name: '15 minutes' , key: 'fifteenMin'};

export type MetricsType = 'downloads' | 'geo' | 'userAgents';

export interface PodcastMetricsModel {
  seriesId: number;
  feederId: string;
  episodeIdsNotInOthers?: number[];
  monthlyDownloads?: any[][];
  monthlyDownloadsOthers?: any[][];
  weeklyDownloads?: any[][];
  weeklyDownloadsOthers?: any[][];
  dailyDownloads?: any[][];
  dailyDownloadsOthers?: any[][];
  hourlyDownloads?: any[][];
  hourlyDownloadsOthers?: any[][];
  fifteenMinDownloads?: any[][];
  fifteenMinDownloadsOthers?: any[][];
}

export interface EpisodeMetricsModel {
  seriesId: number;
  id: number;
  guid: string;
  monthlyDownloads?: any[][];
  weeklyDownloads?: any[][];
  dailyDownloads?: any[][];
  hourlyDownloads?: any[][];
  fifteenMinDownloads?: any[][];
}
