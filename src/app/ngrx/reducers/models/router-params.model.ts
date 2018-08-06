import { IntervalModel, ChartType, MetricsType } from './';

export interface RouterParams {
  podcastId?: string;
  metricsType?: MetricsType;
  chartType?: ChartType;
  interval?: IntervalModel;
  episodePage?: number;
  standardRange?: string;
  beginDate?: Date;
  endDate?: Date;
  podcastSeriesId?: number;
  chartPodcast?: boolean;
  episodeIds?: number[];
}
