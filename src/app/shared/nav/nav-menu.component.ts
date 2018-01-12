import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { FilterModel } from '../../ngrx';
import { selectFilter } from '../../ngrx/reducers';

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
      <a *ngFor="let item of nav"
         [routerLink]="item.link"
         routerLinkActive="active"
         [routerLinkActiveOptions]="{exact: item.exact}">{{item.name}}</a>
    </nav>
  `,
  styleUrls: ['nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  filterSub: Subscription;
  nav: Nav[];

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.filterSub = this.store.select(selectFilter).subscribe((filter: FilterModel) => {
      if (filter.podcastSeriesId && filter.chartType && filter.interval) {
        this.nav = [
          {
            link: `/${filter.podcastSeriesId}/downloads/${filter.chartType}/${filter.interval.key}`,
            name: 'Downloads',
            exact: false
          },
          {
            link: `/${filter.podcastSeriesId}/demographics`,
            name: 'Demographics',
            exact: false
          },
          {
            link: `/${filter.podcastSeriesId}/traffic-sources`,
            name: 'Traffic Sources',
            exact: false
          }
        ];
      }
    });
  }

  ngOnDestroy() {
    if (this.filterSub) { this.filterSub.unsubscribe(); }
  }
}
