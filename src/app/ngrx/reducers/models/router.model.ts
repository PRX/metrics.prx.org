import { IntervalModel, ChartType, MetricsType } from './';

export interface RouterModel {
  metricsType?: MetricsType;
  podcastSeriesId?: number;
  page?: number;
  standardRange?: string;
  beginDate?: Date;
  endDate?: Date;
  interval?: IntervalModel;
  chartType?: ChartType;
  chartPodcast?: boolean;
  episodeIds?: number[];
}
