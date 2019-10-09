import { createSelector } from '@ngrx/store';
import { CategoryChartModel, IndexedChartModel } from 'ngx-prx-styleguide';
import { EpisodeDropday } from '../models';
import { selectSelectedEpisodeDropdays } from './episode-dropday.selectors';
import { getShade, uniqueEpisodeLabel } from '@app/shared/util/chart.util';
import { map } from 'rxjs/operators';

export const cumDownloads = (downloads?: any[][]) => {
  let cum = 0;
  return downloads.map((data: any[]) => {
    cum += data[1];
    return [data[0], cum];
  });
};

export const chartData = (downloads?: any[][]) => {
  return downloads.map(data => data[1]);
};

export const selectDropdayChartMetrics = createSelector(
  selectSelectedEpisodeDropdays,
  (dropdays: EpisodeDropday[]): CategoryChartModel[] | IndexedChartModel[] => {
    return dropdays && dropdays.filter(dropday => dropday.downloads)
      // chart sort is reversed so newer episodes are stacked on top
      .sort((a: EpisodeDropday, b: EpisodeDropday) => a.publishedAt.valueOf() - b.publishedAt.valueOf())
      .map((dropday: EpisodeDropday, episodeIndex, self) => {
        return {
          label: uniqueEpisodeLabel(dropday, self),
          data: chartData(cumDownloads(dropday.downloads)),
          color: getShade(self.length, self.length - (episodeIndex + 1))
        };
      });
  }
);
