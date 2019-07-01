import { createSelector } from '@ngrx/store';
import { CategoryChartModel, IndexedChartModel } from 'ngx-prx-styleguide';
import { EpisodeDropday } from '../models';
import { selectSelectedEpisodeDropdays } from './episode-dropday.selectors';
import { getShade, uniqueEpisodeLabel } from '@app/shared/util/chart.util';

export const selectDropdayChartMetrics = createSelector(
  selectSelectedEpisodeDropdays,
  (dropdays: EpisodeDropday[]): CategoryChartModel[] | IndexedChartModel[] => {
    return dropdays && dropdays.filter(dropday => dropday.downloads)
      // chart sort is reversed so newer episodes are stacked on top
      .sort((a: EpisodeDropday, b: EpisodeDropday) => a.publishedAt.valueOf() - b.publishedAt.valueOf())
      .map((dropday: EpisodeDropday, episodeIndex, self) => {
        let cum = 0;
        return {
          label: uniqueEpisodeLabel(dropday, self),
          data: dropday.downloads
            .map((downloads: any[]) => {
              cum += downloads[1];
              return cum;
            }),
          color: getShade(self.length, self.length - (episodeIndex + 1))
        };
      });
  }
);
