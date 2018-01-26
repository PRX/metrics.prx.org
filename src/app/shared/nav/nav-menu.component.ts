import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterModel } from '../../ngrx';
import { selectRouter } from '../../ngrx/reducers';

interface Nav {
  link: string;
  name: string;
  exact: boolean;
}

@Component({
  selector: 'metrics-nav-menu',
  template: `
    <metrics-profile></metrics-profile>
    <nav>
      <a *ngFor="let item of nav$ | async"
         [routerLink]="item.link"
         routerLinkActive="active"
         [routerLinkActiveOptions]="{exact: item.exact}">{{item.name}}</a>
    </nav>
  `,
  styleUrls: ['nav-menu.component.css']
})
export class NavMenuComponent {
  nav$: Observable<Nav[]>;

  constructor(public store: Store<any>) {
    this.nav$ = this.store.select(selectRouter).map((routerState: RouterModel) => {
      if (routerState.podcastSeriesId) {
        let routes;

        if (routerState.chartType && routerState.interval) {
          routes = [{
            link: `/${routerState.podcastSeriesId}/downloads/${routerState.chartType}/${routerState.interval.key}`,
            name: 'Downloads',
            exact: false
          }];
        } else {
          routes = [{
            link: `/${routerState.podcastSeriesId}/downloads`,
            name: 'Downloads',
            exact: false
          }];
        }

        routes.push(
          {
            link: `/${routerState.podcastSeriesId}/demographics`,
            name: 'Demographics',
            exact: false
          },
          {
            link: `/${routerState.podcastSeriesId}/traffic-sources`,
            name: 'Traffic Sources',
            exact: false
          }
        );

        return routes;
      }
    });
  }
}
