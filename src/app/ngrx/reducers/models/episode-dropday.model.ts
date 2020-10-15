import { IntervalModel } from './interval.model';

export interface EpisodeDropday {
  id: string;
  guid: string;
  title: string;
  podcastId: string;
  publishedAt: Date;
  interval: IntervalModel;
  downloads?: any[][];
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}
