import { Component, OnInit } from '@angular/core';
import { CmsService } from '../core';
import { HalDoc } from 'ngx-prx-styleguide';

import { EpisodeModel, SeriesModel } from '../shared';

@Component({
  selector: 'metrics-downloads',
  template: `
  `
})
export class DownloadsComponent implements OnInit {

  series: SeriesModel[];
  episodes: EpisodeModel[];

  constructor(private cms: CmsService) {}

  ngOnInit() {
    this.cms.auth.subscribe(auth => {
      auth.followItems('prx:series', {filters: 'v4'}).subscribe((series: HalDoc[]) => {
        this.series = series.map(doc => {
          return {
            doc,
            id: doc['id'],
            title: doc['title']
          };
        });

        if (this.series.length > 0) {
          this.getSeriesPodcastDistribution(this.series[0]);
          this.getEpisodes(this.series[0]);
        }
      });
    });
  }

  getSeriesPodcastDistribution(series: SeriesModel) {
    series.doc.followItems('prx:distributions').subscribe((distros: HalDoc[]) => {
      const podcasts = distros.filter((doc => doc['kind'] === 'podcast'));
      if (podcasts && podcasts.length > 0) {
        series.feederUrl = podcasts[0]['url']; // TODO: am I supposed to get the feeder id from this url?
      }
    });
  }

  getEpisodes(series: SeriesModel) {
    series.doc.followItems('prx:stories', {
      per: series.doc.count('prx:stories'),
      filters: 'v4',
      sorts: 'released_at: desc, published_at: desc'
    }).subscribe((episodes: HalDoc[]) => {
      this.episodes = episodes.map(doc => {
        return {
          doc,
          id: doc['id'],
          title: doc['title'],
          publishedAt: doc['publishedAt'] ? new Date(doc['publishedAt']) : null
        };
      });

      this.episodes.forEach(this.getEpisodePodcastDistribution);
    });
  }

  getEpisodePodcastDistribution(episode: EpisodeModel) {
    episode.doc.followItems('prx:distributions').subscribe((distros: HalDoc[]) => {
      const podcasts = distros.filter((doc => doc['kind'] === 'episode'));
      if (podcasts && podcasts.length > 0) {
        episode.feederUrl = podcasts[0]['url'];
      }
    });
  }
}
