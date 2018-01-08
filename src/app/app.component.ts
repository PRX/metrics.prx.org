import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { AuthService } from 'ngx-prx-styleguide';
import { CmsService, HalDoc } from './core';
import { Env } from './core/core.env';
import { PodcastModel, FilterModel } from './ngrx';
import { CmsPodcastsSuccessAction, CmsPodcastEpisodePageAction, CmsPodcastsAction, CmsPodcastsFailureAction } from './ngrx/actions';
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
  filteredPodcastSeriesId: number;
  episodePage: number;

  constructor(
    private auth: AuthService,
    private cms: CmsService,
    public store: Store<any>,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private router: Router,
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
        if (!this.filterStoreSub) {
          this.filterStoreSub = this.store.select(selectFilter).subscribe((newFilter: FilterModel) => {
            const newPodcastSeriesId = newFilter.podcastSeriesId;
            const newEpisodePage = newFilter.page;
            if (newPodcastSeriesId && newPodcastSeriesId !== this.filteredPodcastSeriesId ||
                newEpisodePage !== this.episodePage) {
              const selectedPodcast = this.podcasts.find(p => p.seriesId === newPodcastSeriesId);
              if (selectedPodcast) {
                this.getEpisodes(selectedPodcast, newEpisodePage ? newEpisodePage : 1);
              }
            }
            this.filteredPodcastSeriesId = newPodcastSeriesId;
            this.episodePage = newEpisodePage;
          });
        }

        // Default select the first one by navigating to it. (It'll be the last one that was updated)
        if (!this.filteredPodcastSeriesId) {
          this.router.navigate([this.podcasts[0].seriesId, 'downloads', 'podcast', 'daily']);
        }
      }
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
    this.store.dispatch(new CmsPodcastsAction());
    auth.followItems('prx:series',
      {per: auth.count('prx:series'), filters: 'v4', zoom: 'prx:distributions'}).subscribe((series: HalDoc[]) => {
      if (series && series.length === 0) {
        this.store.dispatch(new CmsPodcastsFailureAction({error: 'Looks like you don\'t have any podcasts.'}));
      } else {
        const podcasts: PodcastModel[] = series.map(doc => {
          return {
            doc,
            seriesId: doc['id'],
            title: doc['title']
          };
        });
        const distros$ = podcasts.map(p => this.getSeriesPodcastDistribution(p));
        Observable.zip(...distros$).subscribe(() => {
          this.store.dispatch(new CmsPodcastsSuccessAction({podcasts: podcasts.filter(p => p.feederId)}));
        });
      }
    },
    error => this.store.dispatch(new CmsPodcastsFailureAction({error})));
  }

  getSeriesPodcastDistribution(podcast: PodcastModel): Observable<HalDoc[]> {
    const obsv$ = podcast.doc.followItems('prx:distributions');
    obsv$.subscribe((distros: HalDoc[]) => {
      const podcasts = distros.filter((doc => doc['kind'] === 'podcast'));
      if (podcasts && podcasts.length > 0 && podcasts[0]['url']) {
        podcast.feederUrl = podcasts[0]['url'];
        const urlParts = podcast.feederUrl.split('/');
        if (urlParts.length > 1) {
          podcast.feederId = urlParts[urlParts.length - 1];
        }
      }
    },
    error => this.store.dispatch(new CmsPodcastsFailureAction({error})));
    return obsv$;
  }

  getEpisodes(podcast: PodcastModel, page: number) {
    this.store.dispatch(new CmsPodcastEpisodePageAction({podcast, page}));
  }
}
