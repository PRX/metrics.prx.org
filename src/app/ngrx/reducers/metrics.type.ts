import { IntervalModel } from './filter.reducer';

// this is the "type" coming from the url and used in the metrics reducers to point to the metrics data property
export type MetricsType = 'downloads' | 'geo' | 'userAgents';

export const getMetricsProperty = (interval: IntervalModel, metricsType: MetricsType) => {
  return interval.key + metricsType.charAt(0).toUpperCase() + metricsType.slice(1);
};
