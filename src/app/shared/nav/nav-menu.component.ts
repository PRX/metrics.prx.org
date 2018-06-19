import { Component, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { RouterModel, MetricsType, METRICSTYPE_DOWNLOADS, METRICSTYPE_TRAFFICSOURCES, METRICSTYPE_DEMOGRAPHICS } from '../../ngrx/';
import {  selectRouter } from '../../ngrx/reducers/selectors';
import * as ACTIONS from '../../ngrx/actions';

@Component({
  selector: 'metrics-nav-menu',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="dropdown-button">
        <button (click)="toggleOpen()" >{{selectedNav?.name}}<span class="down-arrow"></span></button>
      </div>
      <div class="dropdown-content rollout">
        <nav>
          <li *ngFor="let t of types">
            <button
              (click)="routeMetricsType(t.type)"
              [class.active]="routerState.metricsType === t.type">
              <span
                [class]="t.icon"
                [class.grey-darkest]="routerState.metricsType !== t.type"
                [class.active]="routerState.metricsType === t.type" aria-hidden="true"></span>
              <span class="text">{{t.name}}</span>
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
  routerState: RouterModel;
  types = [
    {name: 'Reach', type: METRICSTYPE_DOWNLOADS, icon: 'icon icon-headphones'},
    {name: 'Demographics', type: METRICSTYPE_DEMOGRAPHICS, icon: 'icon icon-globe'},
    {name: 'Devices', type: METRICSTYPE_TRAFFICSOURCES, icon: 'icon icon-smartphone'}
  ];
  open = false;

  constructor(public store: Store<any>) {
    this.routerSub = this.store.pipe(select(selectRouter)).subscribe((routerState) => this.routerState = routerState);
  }

  ngOnDestroy() {
    if (this.routerSub) { this.routerSub.unsubscribe(); }
  }

  routeMetricsType(metricsType: MetricsType) {
    this.store.dispatch(new ACTIONS.RouteMetricsTypeAction({metricsType}));
  }

  get selectedNav() {
    return this.routerState && this.types.find(type => type.type === this.routerState.metricsType);
  }

  toggleOpen() {
    this.open = !this.open;
  }
}
