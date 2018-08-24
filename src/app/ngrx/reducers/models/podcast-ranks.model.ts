import { Rank } from './rank.model';
import { IntervalModel } from './interval.model';

export interface PodcastRanks {
  key: string;
  podcastId: string;
  group: string;
  interval: IntervalModel;
  downloads: any[][];
  ranks: Rank[];
}
