import { createAction, props } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { IntervalModel } from '../';

export const CastlePodcastDownloadsLoad = createAction(
  ActionTypes.CASTLE_PODCAST_DOWNLOADS_LOAD,
  props<{ id: string; interval: IntervalModel; beginDate: Date; endDate: Date }>()
);

export const CastlePodcastDownloadsSuccess = createAction(
  ActionTypes.CASTLE_PODCAST_DOWNLOADS_SUCCESS,
  props<{ id: string; downloads: any[][] }>()
);

export const CastlePodcastDownloadsFailure = createAction(
  ActionTypes.CASTLE_PODCAST_DOWNLOADS_FAILURE,
  props<{ id: string; error: any }>()
);

export const CastleEpisodeDownloadsLoad = createAction(
  ActionTypes.CASTLE_EPISODE_DOWNLOADS_LOAD,
  props<{ podcastId: string; page: number; guid: string; interval: IntervalModel; beginDate: Date; endDate: Date }>()
);

export const CastleEpisodeDownloadsSuccess = createAction(
  ActionTypes.CASTLE_EPISODE_DOWNLOADS_SUCCESS,
  props<{ podcastId: string; page: number; guid: string; downloads: any[][] }>()
);

export const CastleEpisodeDownloadsFailure = createAction(
  ActionTypes.CASTLE_EPISODE_DOWNLOADS_FAILURE,
  props<{ podcastId: string; page: number; guid: string; error: any }>()
);

export const CastlePodcastAllTimeDownloadsLoad = createAction(ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_LOAD, props<{ id: string }>());

export const CastlePodcastAllTimeDownloadsSuccess = createAction(
  ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_SUCCESS,
  props<{ id: string; total: number }>()
);

export const CastlePodcastAllTimeDownloadsFailure = createAction(
  ActionTypes.CASTLE_PODCAST_ALLTIME_DOWNLOADS_FAILURE,
  props<{ id: string; error: any }>()
);

export const CastlePodcastListenersLoad = createAction(
  ActionTypes.CASTLE_PODCAST_LISTENERS_LOAD,
  props<{ id: string; interval: IntervalModel; beginDate: Date; endDate: Date }>()
);

export const CastlePodcastListenersSuccess = createAction(
  ActionTypes.CASTLE_PODCAST_LISTENERS_SUCCESS,
  props<{ id: string; listeners: any[][] }>()
);

export const CastlePodcastListenersFailure = createAction(
  ActionTypes.CASTLE_PODCAST_LISTENERS_FAILURE,
  props<{ id: string; error: any }>()
);

export const CastleEpisodeAllTimeDownloadsLoad = createAction(
  ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_LOAD,
  props<{ podcastId: string; guid: string }>()
);

export const CastleEpisodeAllTimeDownloadsSuccess = createAction(
  ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_SUCCESS,
  props<{ podcastId: string; guid: string; total: number }>()
);

export const CastleEpisodeAllTimeDownloadsFailure = createAction(
  ActionTypes.CASTLE_EPISODE_ALLTIME_DOWNLOADS_FAILURE,
  props<{ podcastId: string; guid: string; error: any }>()
);

export const CastleEpisodeDropdayLoad = createAction(
  ActionTypes.CASTLE_EPISODE_DROPDAY_LOAD,
  props<{ podcastId: string; guid: string; title: string; interval: IntervalModel; publishedAt: Date; days: number }>()
);

export const CastleEpisodeDropdaySuccess = createAction(
  ActionTypes.CASTLE_EPISODE_DROPDAY_SUCCESS,
  props<{ podcastId: string; guid: string; title: string; interval: IntervalModel; publishedAt: Date; downloads: any[][] }>()
);

export const CastleEpisodeDropdayFailure = createAction(
  ActionTypes.CASTLE_EPISODE_DROPDAY_FAILURE,
  props<{ podcastId: string; guid: string; title: string; interval: IntervalModel; publishedAt: Date; error: any }>()
);
