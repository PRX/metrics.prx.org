import { Action } from '@ngrx/store';
import { ActionTypes } from './action.types';

export interface ChartSingleEpisodePayload {
  guid: string;
}

export class ChartSingleEpisodeAction implements Action {
  readonly type = ActionTypes.CHART_SINGLE_EPISODE;

  constructor(public payload: ChartSingleEpisodePayload) {}
}

export interface ChartToggleEpisodePayload {
  guid: string;
  charted: boolean;
}

export class ChartToggleEpisodeAction implements Action {
  readonly type = ActionTypes.CHART_TOGGLE_EPISODE;

  constructor(public payload: ChartToggleEpisodePayload) {}
}

export interface ChartTogglePodcastPayload {
  id: string;
  charted: boolean;
}

export class ChartTogglePodcastAction implements Action {
  readonly type = ActionTypes.CHART_TOGGLE_PODCAST;

  constructor(public payload: ChartTogglePodcastPayload) {}
}
