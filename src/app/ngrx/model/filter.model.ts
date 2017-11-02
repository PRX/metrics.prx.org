import { PodcastModel } from './podcast.model';
import { EpisodeModel } from './episode.model';
import { IntervalModel } from './metrics.model';

export const TODAY = 'Today';
export const THIS_WEEK = 'This week';
export const TWO_WEEKS = '2 weeks';
export const THIS_MONTH = 'This month';
export const THREE_MONTHS = '3 months';
export const THIS_YEAR = 'This year';
export const YESTERDAY = 'Yesterday';
export const LAST_WEEK = 'Last week';
export const PRIOR_TWO_WEEKS = 'Prior 2 weeks';
export const LAST_MONTH = 'Last month';
export const PRIOR_THREE_MONTHS = 'Prior 3 months';
export const LAST_YEAR = 'Last year';

export interface DateRangeModel {
  standardRange?: string;
  range?: any[];
  beginDate: Date;
  endDate: Date;
}

// TODO: filter doesn't yet support type (like downloads on the metrics model)
// --> will a filter apply just to downloads and not be the same if they move to geo data? or would users not want that to stick?
export interface FilterModel {
  podcastSeriesId?: number;
  episodes?: EpisodeModel[];
  standardRange?: string;
  range?: any[];
  beginDate?: Date;
  endDate?: Date;
  interval?: IntervalModel;
}
