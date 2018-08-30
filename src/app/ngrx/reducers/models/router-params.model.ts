import { IntervalModel, ChartType, MetricsType, GroupType } from './';

export interface RouterParams {
  podcastId?: string;
  metricsType?: MetricsType;
  group?: GroupType;
  chartType?: ChartType;
  interval?: IntervalModel;
  episodePage?: number;
  standardRange?: string;
  beginDate?: Date;
  endDate?: Date;
}
