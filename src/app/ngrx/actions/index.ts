import { RouterNavigationAction } from '@ngrx/router-store';

export type AllActions =
  // | CastlePodcastPageLoadAction
  // | CastlePodcastPageSuccessAction
  // | CastlePodcastPageFailureAction
  // | CastleEpisodePageLoadAction
  // | CastleEpisodePageSuccessAction
  // | CastleEpisodePageFailureAction
  // | CastleEpisodeSelectPageLoadAction
  // | CastleEpisodeSelectPageSuccessAction
  // | CastleEpisodeSelectPageFailureAction
  // | CastlePodcastDownloadsLoadAction
  // | CastlePodcastDownloadsSuccessAction
  // | CastlePodcastDownloadsFailureAction
  // | CastleEpisodeDownloadsLoadAction
  // | CastleEpisodeDownloadsSuccessAction
  // | CastleEpisodeDownloadsFailureAction
  // | CastlePodcastAllTimeDownloadsLoadAction
  // | CastlePodcastAllTimeDownloadsSuccessAction
  // | CastlePodcastAllTimeDownloadsFailureAction
  // | CastleEpisodeAllTimeDownloadsLoadAction
  // | CastleEpisodeAllTimeDownloadsSuccessAction
  // | CastleEpisodeAllTimeDownloadsFailureAction
  // | CastleEpisodeDropdayLoadAction
  // | CastleEpisodeDropdaySuccessAction
  // | CastleEpisodeDropdayFailureAction
  // | CastlePodcastListenersLoadAction
  // | CastlePodcastListenersFailureAction
  // | CastlePodcastListenersSuccessAction
  // | CastlePodcastRanksLoadAction
  // | CastlePodcastRanksSuccessAction
  // | CastlePodcastRanksFailureAction
  // | CastlePodcastTotalsLoadAction
  // | CastlePodcastTotalsSuccessAction
  // | CastlePodcastTotalsFailureAction
  // | CastleEpisodeRanksLoadAction
  // | CastleEpisodeRanksSuccessAction
  // | CastleEpisodeRanksFailureAction
  // | CastleEpisodeTotalsLoadAction
  // | CastleEpisodeTotalsSuccessAction
  // | CastleEpisodeTotalsFailureAction
  RouterNavigationAction;
// | GoogleAnalyticsEventAction
// | CustomRouterNavigation
// | RoutePodcastAction
// | RouteEpisodePage
// | RouteChartType
// | RouteInterval
// | RouteStandardRangeAction
// | RouteAdvancedRange
// | RouteMetricsGroupType
// | RouteGroupFilterAction
// | RouteDaysAction;
// | ChartSingleEpisodeAction
// | ChartToggleEpisodeAction
// | ChartTogglePodcastAction
// | ChartToggleGroupAction
// | EpisodeSelectEpisodesAction
// | IdUserinfoLoadAction
// | IdUserinfoSuccessAction
// | IdUserinfoFailureAction;

export { ActionTypes } from './action.types';
export * from './castle-catalog.action.creator';
export * from './castle-downloads.action.creator';
export * from './castle-ranks-totals.action.creator';
export * from './google-analytics.action.creator';
export * from './router.action.creator';
export * from './chart-toggle.action.creator';
export * from './episode-select.action.creator';
export * from './id.action.creator';
