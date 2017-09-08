import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CmsService } from '../core';
import { Env } from '../core/core.env';
import { HalDoc } from 'ngx-prx-styleguide';
import { EpisodeModel, PodcastModel } from '../shared';
import { cmsPodcastFeed, cmsEpisodeGuid } from '../ngrx/actions/cms.action.creator';

@Component({
  selector: 'metrics-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  podcastStore: Observable<PodcastModel[]>;
  podcasts: PodcastModel[];
  selectedPodcast: PodcastModel;
  episodesRequested = false;

  constructor(private cms: CmsService, private store: Store<any>) {
    this.podcastStore = store.select('podcast');
  }

  ngOnInit() {
    this.cms.auth.subscribe(auth => {
      auth.followItems('prx:series', {filters: 'v4'}).subscribe((series: HalDoc[]) => {
        series.map(doc => {
          return {
            doc,
            seriesId: doc['id'],
            title: doc['title']
          };
        }).forEach(this.getSeriesPodcastDistribution.bind(this));
      });
    });

    this.podcastStore.subscribe((state: PodcastModel[]) => {
      this.podcasts = state;

      if (this.podcasts.length > 0) {
        this.selectedPodcast = this.podcasts.find((p: PodcastModel) => {
          return p.feederId === Env.CASTLE_TEST_PODCAST.toString();
        });
        if (this.selectedPodcast && !this.episodesRequested) {
          this.episodesRequested = true;
          this.getEpisodes(this.selectedPodcast);
        }
      }
    });
  }

  getSeriesPodcastDistribution(podcast: PodcastModel) {
    podcast.doc.followItems('prx:distributions').subscribe((distros: HalDoc[]) => {
      const podcasts = distros.filter((doc => doc['kind'] === 'podcast'));
      if (podcasts && podcasts.length > 0) {
        podcast.feederUrl = podcasts[0]['url']; // TODO: am I supposed to get the feeder id from this url?
        const urlParts = podcast.feederUrl.split('/');
        if (urlParts.length > 1) {
          podcast.feederId = urlParts[urlParts.length - 1];

          this.store.dispatch(cmsPodcastFeed(podcast));
        }
      }
    });
  }

  getEpisodes(podcast: PodcastModel) {
    podcast.doc.followItems('prx:stories', {
      per: podcast.doc.count('prx:stories'),
      filters: 'v4',
      sorts: 'released_at: desc, published_at: desc'
    }).subscribe((episodes: HalDoc[]) => {
      episodes.map(doc => {
        return {
          doc,
          id: doc['id'],
          seriesId: podcast.seriesId,
          title: doc['title'],
          publishedAt: doc['publishedAt'] ? new Date(doc['publishedAt']) : null
        };
      }).forEach((e) => {
        // only include episodes with publish dates
        if (e.publishedAt) {
          this.getEpisodePodcastDistribution(podcast, e);
        }
      });
    });
  }

  getEpisodePodcastDistribution(podcast: PodcastModel, episode: EpisodeModel) {
    episode.doc.followItems('prx:distributions').subscribe((distros: HalDoc[]) => {
      const podcasts = distros.filter((doc => doc['kind'] === 'episode'));
      if (podcasts && podcasts.length > 0) {
        episode.feederUrl = podcasts[0]['url'];

        const urlParts = episode.feederUrl.split('/');
        if (urlParts.length > 1) {
          episode.guid = urlParts[urlParts.length - 1];

          this.store.dispatch(cmsEpisodeGuid(podcast, episode));
        }
      }
    });
  }
}
