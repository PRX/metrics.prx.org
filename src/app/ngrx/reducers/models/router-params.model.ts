import { IntervalModel, ChartType, MetricsType, GroupType } from './';
import { BaseRouterStoreState } from '@ngrx/router-store';

export interface RouterParams extends BaseRouterStoreState {
  url: string;
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
  days?: number;
}

export interface PartialRouterParams extends Partial<RouterParams> {
  url?: string;
}
