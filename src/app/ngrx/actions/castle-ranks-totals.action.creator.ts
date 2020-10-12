import { Action, createAction, props } from '@ngrx/store';
import { ActionTypes } from './action.types';
import { IntervalModel, Rank } from '../';

// export interface CastlePodcastRanksLoadPayload {
//   podcastId: string;
//   group: string;
//   filter?: string;
//   interval: IntervalModel;
//   beginDate: Date;
//   endDate: Date;
// }

// export class CastlePodcastRanksLoadAction implements Action {
//   readonly type = ActionTypes.CASTLE_PODCAST_RANKS_LOAD;

//   constructor(public payload: CastlePodcastRanksLoadPayload) {}
// }

export const CastlePodcastRanksLoad = createAction(
  ActionTypes.CASTLE_PODCAST_RANKS_LOAD,
  props<{ podcastId: string; group: string; filter?: string; interval: IntervalModel; beginDate: Date; endDate: Date }>()
);

// export interface CastlePodcastRanksSuccessPayload {
//   podcastId: string;
//   group: string;
//   filter?: string;
//   interval: IntervalModel;
//   beginDate: Date;
//   endDate: Date;
//   downloads: any[][];
//   ranks: Rank[];
// }

// export class CastlePodcastRanksSuccessAction implements Action {
//   readonly type = ActionTypes.CASTLE_PODCAST_RANKS_SUCCESS;

//   constructor(public payload: CastlePodcastRanksSuccessPayload) {}
// }

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

// export interface CastlePodcastRanksFailurePayload {
//   podcastId: string;
//   group: string;
//   filter?: string;
//   interval: IntervalModel;
//   beginDate: Date;
//   endDate: Date;
//   error: any;
// }

// export class CastlePodcastRanksFailureAction implements Action {
//   readonly type = ActionTypes.CASTLE_PODCAST_RANKS_FAILURE;

//   constructor(public payload: CastlePodcastRanksFailurePayload) {}
// }

export const CastlePodcastRanksFailure = createAction(
  ActionTypes.CASTLE_PODCAST_RANKS_FAILURE,
  props<{ podcastId: string; group: string; filter?: string; interval: IntervalModel; beginDate: Date; endDate: Date; error: any }>()
);

// export interface CastlePodcastTotalsLoadPayload {
//   podcastId: string;
//   group: string;
//   filter?: string;
//   beginDate: Date;
//   endDate: Date;
// }

// export class CastlePodcastTotalsLoadAction implements Action {
//   readonly type = ActionTypes.CASTLE_PODCAST_TOTALS_LOAD;

//   constructor(public payload: CastlePodcastTotalsLoadPayload) {}
// }

export const CastlePodcastTotalsLoad = createAction(
  ActionTypes.CASTLE_PODCAST_TOTALS_LOAD,
  props<{ podcastId: string; group: string; filter?: string; beginDate: Date; endDate: Date }>()
);

// export interface CastlePodcastTotalsSuccessPayload {
//   podcastId: string;
//   group: string;
//   filter?: string;
//   beginDate: Date;
//   endDate: Date;
//   ranks: Rank[];
// }

// export class CastlePodcastTotalsSuccessAction implements Action {
//   readonly type = ActionTypes.CASTLE_PODCAST_TOTALS_SUCCESS;

//   constructor(public payload: CastlePodcastTotalsSuccessPayload) {}
// }

export const CastlePodcastTotalsSuccess = createAction(
  ActionTypes.CASTLE_PODCAST_TOTALS_SUCCESS,
  props<{ podcastId: string; group: string; filter?: string; beginDate: Date; endDate: Date; ranks: Rank[] }>()
);

// export interface CastlePodcastTotalsFailurePayload {
//   podcastId: string;
//   group: string;
//   filter?: string;
//   beginDate: Date;
//   endDate: Date;
//   error: any;
// }

// export class CastlePodcastTotalsFailureAction implements Action {
//   readonly type = ActionTypes.CASTLE_PODCAST_TOTALS_FAILURE;

//   constructor(public payload: CastlePodcastTotalsFailurePayload) {}
// }

export const CastlePodcastTotalsFailure = createAction(
  ActionTypes.CASTLE_PODCAST_TOTALS_FAILURE,
  props<{ podcastId: string; group: string; filter?: string; beginDate: Date; endDate: Date; error: any }>()
);
// export interface CastleEpisodeRanksLoadPayload {
//   guid: string;
//   group: string;
//   filter?: string;
//   interval: IntervalModel;
//   beginDate: Date;
//   endDate: Date;
// }

// export class CastleEpisodeRanksLoadAction implements Action {
//   readonly type = ActionTypes.CASTLE_EPISODE_RANKS_LOAD;

//   constructor(public payload: CastleEpisodeRanksLoadPayload) {}
// }

export const CastleEpisodeRanksLoad = createAction(
  ActionTypes.CASTLE_EPISODE_RANKS_LOAD,
  props<{ guid: string; group: string; filter?: string; interval: IntervalModel; beginDate: Date; endDate: Date }>()
);

// export interface CastleEpisodeRanksSuccessPayload {
//   guid: string;
//   group: string;
//   filter?: string;
//   interval: IntervalModel;
//   beginDate: Date;
//   endDate: Date;
//   downloads: any[][];
//   ranks: Rank[];
// }

// export class CastleEpisodeRanksSuccessAction implements Action {
//   readonly type = ActionTypes.CASTLE_EPISODE_RANKS_SUCCESS;

//   constructor(public payload: CastleEpisodeRanksSuccessPayload) {}
// }

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

// export interface CastleEpisodeRanksFailurePayload {
//   guid: string;
//   group: string;
//   filter?: string;
//   interval: IntervalModel;
//   beginDate: Date;
//   endDate: Date;
//   error: any;
// }

// export class CastleEpisodeRanksFailureAction implements Action {
//   readonly type = ActionTypes.CASTLE_EPISODE_RANKS_FAILURE;

//   constructor(public payload: CastleEpisodeRanksFailurePayload) {}
// }

export const CastleEpisodeRanksFailure = createAction(
  ActionTypes.CASTLE_EPISODE_RANKS_FAILURE,
  props<{ guid: string; group: string; filter?: string; interval: IntervalModel; beginDate: Date; endDate: Date; error: any }>()
);

// export interface CastleEpisodeTotalsLoadPayload {
//   guid: string;
//   group: string;
//   filter?: string;
//   beginDate: Date;
//   endDate: Date;
// }

// export class CastleEpisodeTotalsLoadAction implements Action {
//   readonly type = ActionTypes.CASTLE_EPISODE_TOTALS_LOAD;

//   constructor(public payload: CastleEpisodeTotalsLoadPayload) {}
// }

export const CastleEpisodeTotalsLoad = createAction(
  ActionTypes.CASTLE_EPISODE_TOTALS_LOAD,
  props<{ guid: string; group: string; filter?: string; beginDate: Date; endDate: Date }>()
);

// export interface CastleEpisodeTotalsSuccessPayload {
//   guid: string;
//   group: string;
//   filter?: string;
//   beginDate: Date;
//   endDate: Date;
//   ranks: Rank[];
// }

// export class CastleEpisodeTotalsSuccessAction implements Action {
//   readonly type = ActionTypes.CASTLE_EPISODE_TOTALS_SUCCESS;

//   constructor(public payload: CastleEpisodeTotalsSuccessPayload) {}
// }

export const CastleEpisodeTotalsSuccess = createAction(
  ActionTypes.CASTLE_EPISODE_TOTALS_SUCCESS,
  props<{ guid: string; group: string; filter?: string; beginDate: Date; endDate: Date; ranks: Rank[] }>()
);

// export interface CastleEpisodeTotalsFailurePayload {
//   guid: string;
//   group: string;
//   filter?: string;
//   beginDate: Date;
//   endDate: Date;
//   error: any;
// }

// export class CastleEpisodeTotalsFailureAction implements Action {
//   readonly type = ActionTypes.CASTLE_EPISODE_TOTALS_FAILURE;

//   constructor(public payload: CastleEpisodeTotalsFailurePayload) {}
// }

export const CastleEpisodeTotalsFailure = createAction(
  ActionTypes.CASTLE_EPISODE_TOTALS_FAILURE,
  props<{ guid: string; group: string; filter?: string; beginDate: Date; endDate: Date; error: any }>()
);
