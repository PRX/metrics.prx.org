import { TotalsRank } from './totals-rank.model';

export interface PodcastTotals {
  key: string;
  podcastId: string;
  group: string;
  ranks: TotalsRank[];
}
