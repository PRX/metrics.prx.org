import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { DownloadsTableModel, EpisodeAllTimeDownloads, EpisodeDropday } from '../models';
import { selectSelectedEpisodeDropdays } from './episode-dropday.selectors';
import { selectEpisodeAllTimeDownloadsEntities } from './episode-alltime-downloads.selectors';
import { getTotal } from '@app/shared/util/metrics.util';
import { getShade } from '@app/shared/util/chart.util';

export const selectDropdayTableMetrics = createSelector(
  selectSelectedEpisodeDropdays,
  selectEpisodeAllTimeDownloadsEntities,
  (dropdays: EpisodeDropday[],
  allTimeDownloads: Dictionary<EpisodeAllTimeDownloads>): DownloadsTableModel[] => {
    return dropdays && dropdays.filter(dropday => dropday.downloads)
      .sort((a: EpisodeDropday, b: EpisodeDropday) => b.publishedAt.valueOf() - a.publishedAt.valueOf())
      .map((dropday: EpisodeDropday, episodeIndex: number, self) => {
        return {
          id: dropday.guid,
          title: dropday.title,
          publishedAt: dropday.publishedAt,
          color: getShade(self.length, episodeIndex),
          totalForPeriod: getTotal(dropday.downloads),
          allTimeDownloads: allTimeDownloads[dropday.guid] && allTimeDownloads[dropday.guid].allTimeDownloads,
          charted: true
        };
      });
  }
);
