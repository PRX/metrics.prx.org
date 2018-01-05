import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { HalDoc } from './core';
import { Env } from './core/core.env';
import { PodcastModel, FilterModel } from './ngrx';
import { CmsPodcastsAction, CmsPodcastEpisodePageAction } from './ngrx/actions';
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
    public store: Store<any>,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private router: Router,
  ) {
    this.store.dispatch(new CmsPodcastsAction());
    // auth.token.subscribe(token => {
    //   this.loadAccount(token);
    //   if (token) {
    //     cms.auth.subscribe((cmsAuth) => this.loadCmsSeries(cmsAuth));
    //   }
    // });
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
          this.router.navigate([this.podcasts[0].seriesId, 'downloads', 'daily']);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.podcastStoreSub) { this.podcastStoreSub.unsubscribe(); }
    if (this.filterStoreSub) { this.filterStoreSub.unsubscribe(); }
  }

  // loadAccount(token: string) {
  //   if (token) {
  //     this.loggedIn = true;
  //     this.cms.individualAccount.subscribe(doc => {
  //       this.userImageDoc = doc;
  //       this.userName = doc['name'];
  //     });
  //   } else {
  //     this.loggedIn = false;
  //     this.userImageDoc = null;
  //     this.userName = null;
  //   }
  // }

  getEpisodes(podcast: PodcastModel, page: number) {
    this.store.dispatch(new CmsPodcastEpisodePageAction({podcast, page}));
  }
}
