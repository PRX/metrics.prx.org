import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { DownloadsTableModel, Episode, EpisodeAllTimeDownloads, EpisodeDropday } from '../models';
import { selectRoutedPodcastSelectedEpisodes } from './episode-select.selectors';
import { selectEpisodeDropdayEntities } from './episode-dropday.selectors';
import { selectEpisodeAllTimeDownloadsEntities } from './episode-alltime-downloads.selectors';
import { getTotal } from '@app/shared/util/metrics.util';

export const selectDropdayTableMetrics = createSelector(
  selectRoutedPodcastSelectedEpisodes,
  selectEpisodeDropdayEntities,
  selectEpisodeAllTimeDownloadsEntities,
  (episodes: Episode[],
  dropdays: Dictionary<EpisodeDropday>,
  allTimeDownloads: Dictionary<EpisodeAllTimeDownloads>): DownloadsTableModel[] => {
    return episodes && episodes.filter(e => dropdays[e.guid] && dropdays[e.guid].downloads)
      .sort((a: Episode, b: Episode) => b.publishedAt.valueOf() - a.publishedAt.valueOf())
      .map((episode: Episode) => {
        return {
          id: episode.guid,
          title: episode.title,
          publishedAt: episode.publishedAt,
          color: '',
          totalForPeriod: getTotal(dropdays[episode.guid].downloads),
          allTimeDownloads: allTimeDownloads[episode.guid] && allTimeDownloads[episode.guid].allTimeDownloads,
          charted: true
        };
      });
  }
);
