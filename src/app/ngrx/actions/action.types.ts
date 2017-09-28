import { Action } from '@ngrx/store';

export const ActionTypes = {
  CMS_PODCAST_FEED: 'CMS_PODCAST_FEED',
  CMS_EPISODE_GUID: 'CMS_EPISODE_GUID',
  CASTLE_PODCAST_METRICS: 'CASTLE_PODCAST_METRICS',
  CASTLE_EPISODE_METRICS: 'CASTLE_EPISODE_METRICS',
  CASTLE_FILTER: 'CASTLE_FILTER'
};

export interface ActionWithPayload<T> extends Action {
  payload: T;
}
