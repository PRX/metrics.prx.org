import { FilterModel, EpisodeModel } from '../../ngrx';

export const isPodcastChanged = (state: FilterModel, oldState: FilterModel): boolean => {
  return state && state.podcastSeriesId && (!oldState || !oldState.podcastSeriesId || oldState.podcastSeriesId !== state.podcastSeriesId);
};

export const isEpisodesChanged = (state: FilterModel, oldState: FilterModel): boolean => {
  return state && state.page &&
    (!oldState ||
    !oldState.page ||
    state.page !== oldState.page);
};

export const isBeginDateChanged = (state: FilterModel, oldState: FilterModel): boolean => {
  return state.beginDate && (!oldState.beginDate || oldState.beginDate.valueOf() !== state.beginDate.valueOf());
};

export const isEndDateChanged = (state: FilterModel, oldState: FilterModel): boolean => {
  return state.endDate && (!oldState.endDate || oldState.endDate.valueOf() !== state.endDate.valueOf());
};

export const isIntervalChanged = (state: FilterModel, oldState: FilterModel): boolean => {
  return state.interval && (!oldState.interval || oldState.interval.value !== state.interval.value);
};
