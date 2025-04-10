import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { HalDoc } from './core';
import { Env } from './core/core.env';
import { selectUserLoggedIn, selectUserAuthorized, selectUserinfo, selectUserdoc, selectUserError } from './ngrx/reducers/selectors';
import * as ACTIONS from './ngrx/actions';
import { Userinfo } from 'ngx-prx-styleguide';

@Component({
  selector: 'metrics-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  authHost = Env.AUTH_HOST;
  authClient = Env.AUTH_CLIENT_ID;

  loggedIn$: Observable<boolean>;
  authorized$: Observable<boolean>;
  userinfo$: Observable<Userinfo>;
  userDoc$: Observable<HalDoc>;
  userError$: Observable<any>;

  auguryUrl: string;
  feederUrl: string;
  metricsUrl: string;
  userName: string;

  constructor(public store: Store<any>, private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    this.angulartics2GoogleAnalytics.startTracking();
  }

  ngOnInit() {
    this.store.dispatch(ACTIONS.IdUserinfoLoad());
    this.loggedIn$ = this.store.pipe(select(selectUserLoggedIn));
    this.authorized$ = this.store.pipe(select(selectUserAuthorized));
    this.userinfo$ = this.store.pipe(select(selectUserinfo));
    this.userDoc$ = this.store.pipe(select(selectUserdoc));
    this.userError$ = this.store.pipe(select(selectUserError));

    this.store.pipe(select(selectUserinfo)).subscribe(info => {
      if (info) {
        this.userName = info.name;
        this.userImage = info.image_href;

        const apps = Object.values(info.apps || {});
        this.auguryUrl = apps.find(v => v.match(/inventory\./))
        this.feederUrl = apps.find(v => v.match(/podcasts\./))
        this.metricsUrl = apps.find(v => v.match(/metrics\./))
      }
    })
  }
}
