import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { HalDoc } from './core';
import { Env } from './core/core.env';
import { AccountModel, RouterModel } from './ngrx';
import { selectAccount, selectAccountError, selectRouter } from './ngrx/reducers/selectors';
import * as ACTIONS from './ngrx/actions';
import { Userinfo, UserinfoService } from 'ngx-prx-styleguide';

@Component({
  selector: 'metrics-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  authHost = Env.AUTH_HOST;
  authClient = Env.AUTH_CLIENT_ID;

  accountStoreSub: Subscription;
  accountStoreErrorSub: Subscription;
  loggedIn = true; // until proven otherwise
  authorized = false; // until proven otherwise
  userinfo: Userinfo;
  userImageDoc: HalDoc;

  routerSub: Subscription;
  routerState: RouterModel;

  constructor(
    public store: Store<any>,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private user: UserinfoService
  ) {
    this.store.dispatch(new ACTIONS.CmsAccountAction());
    this.store.dispatch(new ACTIONS.CmsPodcastsAction());
    this.user.config(this.authHost);
  }

  ngOnInit() {
    this.accountStoreSub = this.store.select(selectAccount).subscribe((state: AccountModel) => {
      if (state) {
        this.loggedIn = true;
        this.userImageDoc = state.doc;
        this.authorized = true;
        this.user.getUserinfo().subscribe(userinfo => { this.userinfo = userinfo; });
      }
    });

    this.accountStoreErrorSub = this.store.select(selectAccountError).subscribe((error: any) => {
      if (error) {
        this.loggedIn = false;
        this.authorized = false;
        this.userImageDoc = null;
        this.userinfo = null;

        if (error === 'Permission denied') {
          this.loggedIn = true;
          this.authorized = false;
          this.user.getUserinfo().subscribe(userinfo => {
            this.userinfo = userinfo;
            this.user.getUserDoc(userinfo).subscribe(userDoc => { this.userImageDoc = userDoc; });
          });
        }
      }
    });

    // TODO: seems like getEpisodes/CmsPodcastEpisodePageAction should actually happen as a result of CmsPodcastsSuccessAction
    this.routerSub = this.store.select(selectRouter).subscribe((newRouterState: RouterModel) => {
      if (newRouterState && newRouterState.podcastSeriesId) {
        if (!this.routerState) {
          this.getEpisodesAndRecent(newRouterState);
        } else if (newRouterState.podcastSeriesId !== this.routerState.podcastSeriesId) {
          this.getEpisodesAndRecent(newRouterState);
        } else if (newRouterState.page !== this.routerState.page) {
          this.getEpisodes(newRouterState);
        }
        this.routerState = newRouterState;
      }
    });
  }

  ngOnDestroy() {
    if (this.accountStoreSub) { this.accountStoreSub.unsubscribe(); }
    if (this.accountStoreErrorSub) { this.accountStoreErrorSub.unsubscribe(); }
  }

  getEpisodes(state: RouterModel) {
    const seriesId = state.podcastSeriesId;
    const page = state.page;
    this.store.dispatch(new ACTIONS.CmsPodcastEpisodePageAction({seriesId, page}));
  }

  getEpisodesAndRecent(state: RouterModel) {
    this.getEpisodes(state);
    const seriesId = state.podcastSeriesId;
    this.store.dispatch(new ACTIONS.CmsRecentEpisodeAction({seriesId}));
  }
}
