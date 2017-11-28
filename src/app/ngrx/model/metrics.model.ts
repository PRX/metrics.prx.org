export interface IntervalModel {
  value: string;
  name: string;
  key: string;
}

export const INTERVAL_MONTHLY: IntervalModel = { value: '1M', name: 'monthly', key: 'monthly' };
export const INTERVAL_WEEKLY: IntervalModel = { value: '1w', name: 'weekly', key: 'weekly' };
export const INTERVAL_DAILY: IntervalModel = { value: '1d', name: 'daily', key: 'daily' };
export const INTERVAL_HOURLY: IntervalModel = { value: '1h', name: 'hourly', key: 'hourly' };
export const INTERVAL_15MIN: IntervalModel = { value: '15m', name: '15 minutes' , key: 'fifteenMin'};
export const IntervalList = [INTERVAL_MONTHLY, INTERVAL_WEEKLY, INTERVAL_DAILY, INTERVAL_HOURLY, INTERVAL_15MIN];

export type MetricsType = 'downloads' | 'geo' | 'userAgents';

export interface PodcastMetricsModel {
  seriesId: number;
  feederId: string;
  monthlyDownloads?: any[][];
  weeklyDownloads?: any[][];
  dailyDownloads?: any[][];
  hourlyDownloads?: any[][];
  fifteenMinDownloads?: any[][];
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
