import { RouterNavigationAction } from '@ngrx/router-store';
import { CmsPodcastsAction, CmsAllPodcastEpisodeGuidsAction } from './cms.action.creator';
import { CastleFilterAction, CastlePodcastMetricsAction, CastleEpisodeMetricsAction } from './castle.action.creator';
import { GoogleAnalyticsEventAction } from './google-analytics.action.creator';

export type AllActions
  = CmsPodcastsAction
  | CmsAllPodcastEpisodeGuidsAction
  | CastleFilterAction
  | CastlePodcastMetricsAction
  | CastleEpisodeMetricsAction
  | RouterNavigationAction
  | GoogleAnalyticsEventAction;

export { ActionTypes } from './action.types';
export { CmsPodcastsPayload, CmsPodcastsAction,
  CmsEpisodeGuidsPayload, CmsAllPodcastEpisodeGuidsAction } from './cms.action.creator';
export { CastleFilterPayload, CastleFilterAction,
  CastlePodcastMetricsPayload, CastlePodcastMetricsAction,
  CastleEpisodeMetricsPayload, CastleEpisodeMetricsAction } from './castle.action.creator';
export { GoogleAnalyticsEventPayload, GoogleAnalyticsEventAction } from './google-analytics.action.creator';
