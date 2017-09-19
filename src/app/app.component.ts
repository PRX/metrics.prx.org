import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AuthService } from 'ngx-prx-styleguide';
import { CmsService, HalDoc } from './core';
import { Env } from './core/core.env';
import { EpisodeModel, PodcastModel, FilterModel } from './ngrx/model';
import { cmsPodcastFeed, cmsEpisodeGuid } from './ngrx/actions/cms.action.creator';
import { castleFilter } from './ngrx/actions/castle.action.creator';

@Component({
  selector: 'metrics-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  authHost = Env.AUTH_HOST;
  authClient = Env.AUTH_CLIENT_ID;

  loggedIn = true; // until proven otherwise
  userName: string;
  userImageDoc: HalDoc;

  podcastStore: Observable<PodcastModel[]>;
  podcasts: PodcastModel[];
  filterStore: Observable<FilterModel[]>;
  filter: FilterModel;

  constructor(
    private auth: AuthService,
    private cms: CmsService,
    public store: Store<any>
  ) {
    auth.token.subscribe(token => {
      this.loadAccount(token);
      if (token) {
        cms.auth.subscribe((cmsAuth) => this.loadCmsSeries(cmsAuth));
      }
    });

    this.podcastStore = store.select('podcast');
    this.filterStore = store.select('filter');
  }

  ngOnInit() {
    this.podcastStore.subscribe((state: PodcastModel[]) => {
      this.podcasts = state;

      if (this.podcasts.length > 0) {
        let selectedPodcast;
        if (Env.CASTLE_TEST_PODCAST) {
          selectedPodcast = this.podcasts.find((p: PodcastModel) => {
            return p.feederId === Env.CASTLE_TEST_PODCAST.toString();
          });
        } else {
          selectedPodcast = this.podcasts[0];
        }
        if (selectedPodcast &&
          (!this.filter || (this.filter && this.filter.podcast && selectedPodcast.seriesId !== this.filter.podcast.seriesId))) {
          this.store.dispatch(castleFilter({podcast: selectedPodcast}));
        }
      }
    });

    this.filterStore.subscribe((state: FilterModel) => {
      if (state.podcast && (!this.filter || state.podcast.seriesId !== this.filter.podcast.seriesId)) {
        this.filter = state;
        this.getEpisodes(this.filter.podcast);
      }
    });
  }

  loadAccount(token: string) {
    if (token) {
      this.loggedIn = true;
      this.cms.individualAccount.subscribe(doc => {
        this.userImageDoc = doc;
        this.userName = doc['name'];
      });
    } else {
      this.loggedIn = false;
      this.userImageDoc = null;
      this.userName = null;
    }
  }

  loadCmsSeries(auth: HalDoc) {
    auth.followItems('prx:series', {filters: 'v4'}).subscribe((series: HalDoc[]) => {
      series.map(doc => {
        return {
          doc,
          seriesId: doc['id'],
          title: doc['title']
        };
      }).forEach(this.getSeriesPodcastDistribution.bind(this));
    });
  }

  getSeriesPodcastDistribution(podcast: PodcastModel) {
    podcast.doc.followItems('prx:distributions').subscribe((distros: HalDoc[]) => {
      const podcasts = distros.filter((doc => doc['kind'] === 'podcast'));
      if (podcasts && podcasts.length > 0) {
        podcast.feederUrl = podcasts[0]['url'];
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
