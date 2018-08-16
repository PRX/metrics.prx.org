import { Totals } from './totals.model';
import { IntervalModel } from './interval.model';

export interface PodcastTotals {
  key: string;
  podcastId: string;
  group: string;
  interval: IntervalModel;
  downloads: any[][];
  ranks: Totals[];
}
