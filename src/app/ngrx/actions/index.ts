import { RouterNavigationAction } from '@ngrx/router-store';
import { CmsPodcastsAction,
  CmsPodcastEpisodePageAction, CmsPodcastEpisodePageSuccessAction, CmsPodcastEpisodePageFailureAction } from './cms.action.creator';
import { CastleFilterAction, CastlePodcastMetricsAction, CastlePodcastChartToggleAction,
  CastleEpisodeMetricsAction, CastleEpisodeChartToggleAction } from './castle.action.creator';
import { GoogleAnalyticsEventAction } from './google-analytics.action.creator';

export type AllActions
  = CmsPodcastsAction
  | CmsPodcastEpisodePageAction
  | CmsPodcastEpisodePageSuccessAction
  | CmsPodcastEpisodePageFailureAction
  | CastleFilterAction
  | CastlePodcastMetricsAction
  | CastlePodcastChartToggleAction
  | CastleEpisodeMetricsAction
  | CastleEpisodeChartToggleAction
  | RouterNavigationAction
  | GoogleAnalyticsEventAction;

export { ActionTypes } from './action.types';
export { CmsPodcastsPayload, CmsPodcastsAction,
  CmsEpisodePagePayload, CmsPodcastEpisodePageAction,
  CmsEpisodePageSuccessPayload, CmsPodcastEpisodePageSuccessAction, CmsPodcastEpisodePageFailureAction } from './cms.action.creator';
export { CastleFilterPayload, CastleFilterAction,
  CastlePodcastMetricsPayload, CastlePodcastMetricsAction,
  CastlePodcastChartTogglePayload, CastlePodcastChartToggleAction,
  CastleEpisodeMetricsPayload, CastleEpisodeMetricsAction,
  CastleEpisodeChartTogglePayload, CastleEpisodeChartToggleAction} from './castle.action.creator';
export { GoogleAnalyticsEventPayload, GoogleAnalyticsEventAction } from './google-analytics.action.creator';
