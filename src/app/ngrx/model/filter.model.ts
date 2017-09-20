import { PodcastModel } from './podcast.model';
import { EpisodeModel } from './episode.model';
import { IntervalModel } from './metrics.model';

export interface FilterModel {
  podcast?: PodcastModel;
  episodes?: EpisodeModel[];
  beginDate?: Date;
  endDate?: Date;
  interval?: IntervalModel;
}
