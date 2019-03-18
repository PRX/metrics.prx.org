import { IntervalModel, ChartType, MetricsType, GroupType } from './';

export interface RouterParams {
  podcastId?: string;
  metricsType?: MetricsType;
  group?: GroupType;
  filter?: string;
  chartType?: ChartType;
  interval?: IntervalModel;
  episodePage?: number;
  guids?: string[];
  standardRange?: string;
  beginDate?: Date;
  endDate?: Date;
}
