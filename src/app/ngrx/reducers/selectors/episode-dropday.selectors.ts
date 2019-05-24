import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromEpisodeDropday from '../episode-dropday.reducer';
import { EpisodeDropday } from '../models';
import { selectDropdaySelectedEpisodeGuids } from './episode-select.selectors';

export const selectEpisodeDropdayState = createFeatureSelector<fromEpisodeDropday.State>('episodeDropday');

export const selectEpisodeDropdayGuids = createSelector(
  selectEpisodeDropdayState,
  fromEpisodeDropday.selectEpisodeDropdayGuids
);
export const selectEpisodeDropdayEntities = createSelector(
  selectEpisodeDropdayState,
  fromEpisodeDropday.selectEpisodeDropdayEntities
);
export const selectAllEpisodeDropday = createSelector(
  selectEpisodeDropdayState,
  fromEpisodeDropday.selectAllEpisodeDropday
);

export const selectEpisodeDropdayLoading = createSelector(selectAllEpisodeDropday, (dropdays: EpisodeDropday[]) => {
  return dropdays.some((d: EpisodeDropday) => d.loading);
});
export const selectEpisodeDropdayLoaded = createSelector(selectAllEpisodeDropday, (dropdays: EpisodeDropday[]) => {
  return dropdays.every((d: EpisodeDropday) => d.loaded || d.loaded === undefined);
});
export const selectEpisodeDropdayErrors = createSelector(selectAllEpisodeDropday, (dropdays: EpisodeDropday[]) => {
  return dropdays.filter(d => d.error);
});

export const selectSelectedEpisodeDropdayErrors = createSelector(
  selectEpisodeDropdayErrors,
  selectDropdaySelectedEpisodeGuids,
  (dropdayErrors: EpisodeDropday[], guids: string[]) => {
    return dropdayErrors.filter(dropday => guids.indexOf(dropday.guid) > -1 );
  }
);

export const selectSelectedEpisodeDropdays = createSelector(
  selectEpisodeDropdayEntities,
  selectDropdaySelectedEpisodeGuids,
  (dropdays, guids): EpisodeDropday[] => {
    return guids && guids.filter(guid => dropdays[guid]).map(guid => dropdays[guid]);
  }
);
