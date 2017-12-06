import { FilterModel, EpisodeModel } from '../../ngrx/model';

export const isPodcastChanged = (state: FilterModel, oldState: FilterModel): boolean => {
  return state && state.podcastSeriesId && (!oldState || !oldState.podcastSeriesId || oldState.podcastSeriesId !== state.podcastSeriesId);
};

export const isEpisodesChanged = (state: FilterModel, oldState: FilterModel): boolean => {
  return state && state.episodeIds &&
    (!oldState ||
    !oldState.episodeIds ||
    !state.episodeIds.every(id => oldState.episodeIds.indexOf(id) !== -1) ||
    !oldState.episodeIds.every(id => state.episodeIds.indexOf(id) !== -1));
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

export const getEpisodesPage = (pageNumber: number, episodes: EpisodeModel[]): EpisodeModel[] => {
  const pageSize = 10;
  const end = Math.min(episodes.length, pageNumber * pageSize);
  return episodes.slice((pageNumber - 1) * pageSize, end);
};
