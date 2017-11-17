import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { AuthService } from 'ngx-prx-styleguide';
import { CmsService, HalDoc } from './core';
import { Env } from './core/core.env';
import { EpisodeModel, PodcastModel, FilterModel } from './ngrx/model';
import { CastleFilterAction, CmsPodcastFeedAction, CmsAllPodcastEpisodeGuidsAction } from './ngrx/actions';
import { selectPodcasts, selectFilter } from './ngrx/reducers';

@Component({
  selector: 'metrics-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  authHost = Env.AUTH_HOST;
  authClient = Env.AUTH_CLIENT_ID;

  loggedIn = true; // until proven otherwise
  userName: string;
  userImageDoc: HalDoc;

  podcastStoreSub: Subscription;
  podcasts: PodcastModel[];
  filterStoreSub: Subscription;
  filter: FilterModel;

  error: string;

  constructor(
    private auth: AuthService,
    private cms: CmsService,
    public store: Store<any>,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) {
    auth.token.subscribe(token => {
      this.loadAccount(token);
      if (token) {
        cms.auth.subscribe((cmsAuth) => this.loadCmsSeries(cmsAuth));
      }
    });
  }

  ngOnInit() {
    this.podcastStoreSub = this.store.select(selectPodcasts).subscribe((state: PodcastModel[]) => {
      this.podcasts = state;

      if (this.podcasts && this.podcasts.length > 0) {
        const selectedPodcast = this.podcasts[0]; // Default select the first one. It'll be the last one that was updated
        if (selectedPodcast &&
          (!this.filter || !this.filter.podcast ||
          this.filter.podcast && selectedPodcast.seriesId !== this.filter.podcast.seriesId)) {
          this.store.dispatch(new CastleFilterAction({filter: {podcast: selectedPodcast}}));
        }
      }
    });

    this.filterStoreSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
      if (newFilter.podcast && (!this.filter || !this.filter.podcast || newFilter.podcast.seriesId !== this.filter.podcast.seriesId)) {
        this.getEpisodes(newFilter.podcast);
      }
      this.filter = newFilter;
    });
  }

  ngOnDestroy() {
    if (this.podcastStoreSub) { this.podcastStoreSub.unsubscribe(); }
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
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
    auth.followItems('prx:series', {filters: 'v4', zoom: 'prx:distributions'}).subscribe((series: HalDoc[]) => {
      if (series.length === 0) {
        this.error = 'Looks like you don\'t have any podcasts.';
      }
      series.forEach((doc: HalDoc) => {
        const podcast: PodcastModel = {
          doc,
          seriesId: doc['id'],
          title: doc['title']
        };
        this.getSeriesPodcastDistribution(podcast);
      });
    });
  }

  getSeriesPodcastDistribution(podcast: PodcastModel) {
    podcast.doc.followItems('prx:distributions').subscribe((distros: HalDoc[]) => {
      const podcasts = distros.filter((doc => doc['kind'] === 'podcast'));
      if (podcasts && podcasts.length > 0 && podcasts[0]['url']) {
        podcast.feederUrl = podcasts[0]['url'];
        const urlParts = podcast.feederUrl.split('/');
        if (urlParts.length > 1) {
          podcast.feederId = urlParts[urlParts.length - 1];

          this.store.dispatch(new CmsPodcastFeedAction({podcast}));
        }
      }
    });
  }

  getEpisodes(podcast: PodcastModel) {
    const distObsv = [];
    podcast.doc.followItems('prx:stories', {
      per: podcast.doc.count('prx:stories'),
      filters: 'v4',
      zoom: 'prx:distributions'
    }).subscribe((docs: HalDoc[]) => {
      const episodes: EpisodeModel[] = docs
      // only include episodes with publish dates
        .filter(doc => doc['publishedAt'] && new Date(doc['publishedAt']).valueOf() <= new Date().valueOf())
        .map(doc => {
          return {
            doc,
            id: doc['id'],
            seriesId: podcast.seriesId,
            title: doc['title'],
            publishedAt: doc['publishedAt'] ? new Date(doc['publishedAt']) : null
          };
        });
      episodes.forEach((e) => {
        distObsv.push(this.getEpisodePodcastDistribution(e));
      });
      // wait for all the episode podcast distributions, then add all episodes to state at once
      Observable.zip(...distObsv).subscribe(() => {
        this.store.dispatch(new CmsAllPodcastEpisodeGuidsAction({podcast, episodes}));
      });
    });
  }

  getEpisodePodcastDistribution(episode: EpisodeModel): Observable<HalDoc[]> {
    const obsv = episode.doc.followItems('prx:distributions');
    obsv.subscribe((distros: HalDoc[]) => {
      const podcasts = distros.filter((doc => doc['kind'] === 'episode'));
      if (podcasts && podcasts.length > 0 && podcasts[0]['url']) {
        episode.feederUrl = podcasts[0]['url'];

        const urlParts = episode.feederUrl.split('/');
        if (urlParts.length > 1) {
          episode.guid = urlParts[urlParts.length - 1];
        }
      }
    });
    return obsv;
  }
}
