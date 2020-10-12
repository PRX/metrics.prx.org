import { createAction, props } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { Podcast, Episode } from '..';

export const CastlePodcastPageLoad = createAction(ActionTypes.CASTLE_PODCAST_PAGE_LOAD, props<{ page: number; all?: boolean }>());

export const CastlePodcastPageSuccess = createAction(
  ActionTypes.CASTLE_PODCAST_PAGE_SUCCESS,
  props<{ podcasts: Podcast[]; page: number; total: number; all?: boolean }>()
);

export const CastlePodcastPageFailure = createAction(ActionTypes.CASTLE_PODCAST_PAGE_FAILURE, props<{ error: any }>());

export const CastleEpisodePageLoad = createAction(
  ActionTypes.CASTLE_EPISODE_PAGE_LOAD,
  props<{ podcastId: string; page: number; per: number; search?: string }>()
);

export const CastleEpisodeSelectPageLoad = createAction(
  ActionTypes.CASTLE_EPISODE_SELECT_PAGE_LOAD,
  props<{ podcastId: string; page: number; per: number; search?: string }>()
);

export const CastleEpisodePageSuccess = createAction(
  ActionTypes.CASTLE_EPISODE_PAGE_SUCCESS,
  props<{ page: number; per: number; total: number; search?: string; episodes: Episode[] }>()
);

export const CastleEpisodeSelectPageSuccess = createAction(
  ActionTypes.CASTLE_EPISODE_SELECT_PAGE_SUCCESS,
  props<{ page: number; per: number; total: number; search?: string; episodes: Episode[] }>()
);

export const CastleEpisodePageFailure = createAction(ActionTypes.CASTLE_EPISODE_PAGE_FAILURE, props<{ error: any }>());

export const CastleEpisodeSelectPageFailure = createAction(ActionTypes.CASTLE_EPISODE_SELECT_PAGE_FAILURE, props<{ error: any }>());
