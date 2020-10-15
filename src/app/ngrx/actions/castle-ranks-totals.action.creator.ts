import { createAction, props } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { IntervalModel, Rank } from '../';

export const CastlePodcastRanksLoad = createAction(
  ActionTypes.CASTLE_PODCAST_RANKS_LOAD,
  props<{ podcastId: string; group: string; filter?: string; interval: IntervalModel; beginDate: Date; endDate: Date }>()
);

export const CastlePodcastRanksSuccess = createAction(
  ActionTypes.CASTLE_PODCAST_RANKS_SUCCESS,
  props<{
    podcastId: string;
    group: string;
    filter?: string;
    interval: IntervalModel;
    beginDate: Date;
    endDate: Date;
    downloads: any[][];
    ranks: Rank[];
  }>()
);

export const CastlePodcastRanksFailure = createAction(
  ActionTypes.CASTLE_PODCAST_RANKS_FAILURE,
  props<{ podcastId: string; group: string; filter?: string; interval: IntervalModel; beginDate: Date; endDate: Date; error: any }>()
);

export const CastlePodcastTotalsLoad = createAction(
  ActionTypes.CASTLE_PODCAST_TOTALS_LOAD,
  props<{ podcastId: string; group: string; filter?: string; beginDate: Date; endDate: Date }>()
);

export const CastlePodcastTotalsSuccess = createAction(
  ActionTypes.CASTLE_PODCAST_TOTALS_SUCCESS,
  props<{ podcastId: string; group: string; filter?: string; beginDate: Date; endDate: Date; ranks: Rank[] }>()
);

export const CastlePodcastTotalsFailure = createAction(
  ActionTypes.CASTLE_PODCAST_TOTALS_FAILURE,
  props<{ podcastId: string; group: string; filter?: string; beginDate: Date; endDate: Date; error: any }>()
);

export const CastleEpisodeRanksLoad = createAction(
  ActionTypes.CASTLE_EPISODE_RANKS_LOAD,
  props<{ guid: string; group: string; filter?: string; interval: IntervalModel; beginDate: Date; endDate: Date }>()
);

export const CastleEpisodeRanksSuccess = createAction(
  ActionTypes.CASTLE_EPISODE_RANKS_SUCCESS,
  props<{
    guid: string;
    group: string;
    filter?: string;
    interval: IntervalModel;
    beginDate: Date;
    endDate: Date;
    downloads: any[][];
    ranks: Rank[];
  }>()
);

export const CastleEpisodeRanksFailure = createAction(
  ActionTypes.CASTLE_EPISODE_RANKS_FAILURE,
  props<{ guid: string; group: string; filter?: string; interval: IntervalModel; beginDate: Date; endDate: Date; error: any }>()
);

export const CastleEpisodeTotalsLoad = createAction(
  ActionTypes.CASTLE_EPISODE_TOTALS_LOAD,
  props<{ guid: string; group: string; filter?: string; beginDate: Date; endDate: Date }>()
);

export const CastleEpisodeTotalsSuccess = createAction(
  ActionTypes.CASTLE_EPISODE_TOTALS_SUCCESS,
  props<{ guid: string; group: string; filter?: string; beginDate: Date; endDate: Date; ranks: Rank[] }>()
);

export const CastleEpisodeTotalsFailure = createAction(
  ActionTypes.CASTLE_EPISODE_TOTALS_FAILURE,
  props<{ guid: string; group: string; filter?: string; beginDate: Date; endDate: Date; error: any }>()
);
