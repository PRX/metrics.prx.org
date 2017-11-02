import { RouterStateSnapshot } from '@angular/router';
import { RouterNavigationPayload } from '@ngrx/router-store';
import { CmsPodcastsPayload, CmsEpisodeGuidsPayload } from './cms.action.creator';
import { CastleFilterPayload, CastlePodcastMetricsPayload, CastleEpisodeMetricsPayload } from './castle.action.creator';


export type All
  = CmsPodcastsPayload
  | CmsEpisodeGuidsPayload
  | CastleFilterPayload
  | CastlePodcastMetricsPayload
  | CastleEpisodeMetricsPayload
  | RouterNavigationPayload<RouterStateSnapshot>;

export { ActionTypes, ActionWithPayload } from './action.types';
export { CmsPodcastsPayload, CmsPodcastsAction, CmsPodcastsSuccessAction, CmsPodcastsFailureAction,
  CmsEpisodeGuidsPayload, CmsAllPodcastEpisodeGuidsAction } from './cms.action.creator';
export { CastleFilterPayload, CastleFilterAction,
  CastlePodcastMetricsPayload, CastlePodcastMetricsAction,
  CastleEpisodeMetricsPayload, CastleEpisodeMetricsAction } from './castle.action.creator';
