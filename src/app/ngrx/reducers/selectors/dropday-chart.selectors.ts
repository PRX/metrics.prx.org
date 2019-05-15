import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { CategoryChartModel, IndexedChartModel } from 'ngx-prx-styleguide';
import { Episode, EpisodeDropday, ChartType,
  CHARTTYPE_HORIZBAR, CHARTTYPE_EPISODES } from '../models';
import { selectChartTypeRoute } from './router.selectors';
import { selectRoutedPodcastSelectedEpisodes } from './episode-select.selectors';
import { selectEpisodeDropdayEntities } from './episode-dropday.selectors';
import { getTotal } from '@app/shared/util/metrics.util';
import { getColor, uniqueEpisodeLabel } from '@app/shared/util/chart.util';

export const selectDropdayChartMetrics = createSelector(
  selectRoutedPodcastSelectedEpisodes,
  selectEpisodeDropdayEntities,
  selectChartTypeRoute,
  (episodes: Episode[], dropdays: Dictionary<EpisodeDropday>, chartType: ChartType): CategoryChartModel[] | IndexedChartModel[] => {
    if (chartType === CHARTTYPE_HORIZBAR) {
      return episodes && episodes.filter(e => dropdays[e.guid] && dropdays[e.guid].downloads)
        .map((episode: Episode, i, self) => {
          const label = uniqueEpisodeLabel(episode, self);
          return {
            // truncate episode name for chart labels
            label: label.length > 32 ? `${label.substring(0, 29)}...` : label,
            value: getTotal(dropdays[episode.guid].downloads)
          };
        })
        .sort((a: CategoryChartModel, b: CategoryChartModel) => b.value - a.value);
    } else  if (chartType === CHARTTYPE_EPISODES) {
      return episodes && episodes.filter(e => dropdays[e.guid] && dropdays[e.guid].downloads)
        .sort((a: Episode, b: Episode) => b.publishedAt.valueOf() - a.publishedAt.valueOf())
        .map((episode: Episode, episodeIndex, self) => {
          let cum = 0;
          return {
            label: uniqueEpisodeLabel(episode, self),
            data: dropdays[episode.guid].downloads
              .map((downloads: any[]) => {
                cum += downloads[1];
                return cum;
              }),
            color: getColor(episodeIndex)
          };
        });
    }
  }
);
