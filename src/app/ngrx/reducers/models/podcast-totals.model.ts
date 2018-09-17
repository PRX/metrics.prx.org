import { Rank } from './rank.model';

export interface PodcastTotals {
  key: string;
  podcastId: string;
  group: string;
  ranks: Rank[];
  loaded: boolean;
  loading: boolean;
  error: any;
}
