import { RanksRank } from './ranks-rank.model';
import { IntervalModel } from './interval.model';

export interface PodcastRanks {
  key: string;
  podcastId: string;
  group: string;
  interval: IntervalModel;
  downloads: any[][];
  ranks: RanksRank[];
}
