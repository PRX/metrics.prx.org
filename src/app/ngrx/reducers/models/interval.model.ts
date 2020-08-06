export interface IntervalModel {
  value: string;
  name: string;
  key: string;
}

export const INTERVAL_LASTWEEK: IntervalModel = { value: 'LAST_WEEK', name: 'Last Week', key: 'last_week' };
export const INTERVAL_LAST28DAYS: IntervalModel = { value: 'LAST_28', name: 'Last 28 Days', key: 'last_28' };
export const INTERVAL_MONTHLY: IntervalModel = { value: '1M', name: 'Monthly', key: 'monthly' };
export const INTERVAL_WEEKLY: IntervalModel = { value: '1w', name: 'Weekly', key: 'weekly' };
export const INTERVAL_DAILY: IntervalModel = { value: '1d', name: 'Daily', key: 'daily' };
export const INTERVAL_HOURLY: IntervalModel = { value: '1h', name: 'Hourly', key: 'hourly' };
export const IntervalList = [INTERVAL_LASTWEEK, INTERVAL_LAST28DAYS, INTERVAL_HOURLY, INTERVAL_DAILY, INTERVAL_WEEKLY, INTERVAL_MONTHLY];
