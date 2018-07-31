import { RouterParams } from '../../ngrx';

export const isPodcastChanged = (state: RouterParams, oldState: RouterParams): boolean => {
  return state && state.podcastId && (!oldState || !oldState.podcastId || oldState.podcastId !== state.podcastId);
};

export const isEpisodesChanged = (state: RouterParams, oldState: RouterParams): boolean => {
  return state && state.episodePage &&
    (!oldState ||
    !oldState.episodePage ||
    state.episodePage !== oldState.episodePage);
};

export const isBeginDateChanged = (state: RouterParams, oldState: RouterParams): boolean => {
  return state.beginDate && (!oldState.beginDate || oldState.beginDate.valueOf() !== state.beginDate.valueOf());
};

export const isEndDateChanged = (state: RouterParams, oldState: RouterParams): boolean => {
  return state.endDate && (!oldState.endDate || oldState.endDate.valueOf() !== state.endDate.valueOf());
};

export const isIntervalChanged = (state: RouterParams, oldState: RouterParams): boolean => {
  return state.interval && (!oldState.interval || oldState.interval.value !== state.interval.value);
};
