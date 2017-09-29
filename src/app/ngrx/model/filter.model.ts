import { PodcastModel } from './podcast.model';
import { EpisodeModel } from './episode.model';
import { IntervalModel } from './metrics.model';

// TODO: filter doesn't yet support type (like downloads on the metrics model)
// --> will a filter apply just to downloads and not be the same if they move to geo data? or would users not want that to stick?
export interface FilterModel {
  podcast?: PodcastModel;
  episodes?: EpisodeModel[];
  beginDate?: Date;
  endDate?: Date;
  interval?: IntervalModel;
}
