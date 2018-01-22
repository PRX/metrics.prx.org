import { IntervalModel } from './interval.model';

export const METRICSTYPE_DOWNLOADS = 'downloads';
export const METRICSTYPE_DEMOGRAPHICS = 'demographics';
export const METRICSTYPE_TRAFFICSOURCES = 'traffic-sources';
export type MetricsType = 'downloads' | 'demographics' | 'traffic-sources';

export const getMetricsProperty = (interval: IntervalModel, metricsType: MetricsType) => {
  return interval.key + metricsType.charAt(0).toUpperCase() + metricsType.slice(1);
};
