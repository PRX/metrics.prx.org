import { createSelector } from '@ngrx/store';
import { CategoryChartModel, IndexedChartModel } from 'ngx-prx-styleguide';
import { EpisodeDropday, ChartType,
  CHARTTYPE_HORIZBAR, CHARTTYPE_EPISODES } from '../models';
import { selectChartTypeRoute } from './router.selectors';
import { selectSelectedEpisodeDropdays } from './episode-dropday.selectors';
import { getTotal } from '@app/shared/util/metrics.util';
import { getShade, uniqueEpisodeLabel } from '@app/shared/util/chart.util';

export const selectDropdayChartMetrics = createSelector(
  selectSelectedEpisodeDropdays,
  selectChartTypeRoute,
  (dropdays: EpisodeDropday[],
  chartType: ChartType): CategoryChartModel[] | IndexedChartModel[] => {
    if (chartType === CHARTTYPE_HORIZBAR) {
      return dropdays && dropdays.filter(dropday => dropday.downloads)
        .map((dropday: EpisodeDropday, i, self) => {
          const label = uniqueEpisodeLabel(dropday, self);
          return {
            // truncate episode name for chart labels
            label: label.length > 32 ? `${label.substring(0, 29)}...` : label,
            value: getTotal(dropday.downloads)
          };
        })
        .sort((a: CategoryChartModel, b: CategoryChartModel) => b.value - a.value);
    } else  if (chartType === CHARTTYPE_EPISODES) {
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
  }
);
