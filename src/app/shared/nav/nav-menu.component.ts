import { Component, OnDestroy, HostListener } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { RouterParams, MetricsType, METRICSTYPE_DOWNLOADS, METRICSTYPE_TRAFFICSOURCES, METRICSTYPE_DEMOGRAPHICS } from '../../ngrx/';
import {  selectRouter } from '../../ngrx/reducers/selectors';
import * as ACTIONS from '../../ngrx/actions';

@Component({
  selector: 'metrics-nav-menu',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button">
        <button (click)="toggleOpen()" >
          <span class="nav-label">
            <span
              [class]="'grey-darkest ' + getTypeWithIcon(routerParams.metricsType)?.icon" aria-hidden="true"></span>
            <span class="text">{{routerParams.metricsType}}</span>
          </span>
          <span class="down-arrow"></span>
        </button>
      </div>
      <div class="dropdown-content rollout">
        <nav>
          <li *ngFor="let t of types">
            <button
              (click)="routeMetricsType(t.type)"
              [class.active]="routerParams.metricsType === t.type">
              <span
                [class]="t.icon"
                [class.grey-darkest]="routerParams.metricsType !== t.type"
                [class.active]="routerParams.metricsType === t.type" aria-hidden="true"></span>
              <span class="text">{{t.type}}</span>
            </button>
          </li>
        </nav>
      </div>
    </div>
  `,
  styleUrls: ['nav-menu.component.css']
})
export class NavMenuComponent implements OnDestroy {
  routerSub: Subscription;
  routerParams: RouterParams;
  types = [
    {type: METRICSTYPE_DOWNLOADS, icon: 'icon icon-headphones'},
    {type: METRICSTYPE_DEMOGRAPHICS, icon: 'icon icon-globe'},
    {type: METRICSTYPE_TRAFFICSOURCES, icon: 'icon icon-smartphone'}
  ];
  open = false;
  @HostListener('window: scroll', [])
  onWindowScroll() {
    this.open = false;
  }

  constructor(public store: Store<any>) {
    this.routerSub = this.store.pipe(select(selectRouter)).subscribe((routerParams) => this.routerParams = routerParams);
  }

  ngOnDestroy() {
    if (this.routerSub) { this.routerSub.unsubscribe(); }
  }

  routeMetricsType(metricsType: MetricsType) {
    this.open = false;
    this.store.dispatch(new ACTIONS.RouteMetricsTypeAction({metricsType}));
  }

  toggleOpen() {
    this.open = !this.open;
  }

  getTypeWithIcon(metricsType: MetricsType) {
    return this.types.find(t => t.type === metricsType);
  }
}
