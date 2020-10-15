import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectRouter } from '@app/ngrx/reducers/selectors';
import { GroupType, MetricsType, RouterParams } from '../../ngrx';
import * as ACTIONS from '@app/ngrx/actions';

@Component({
  selector: 'metrics-nav-menu',
  template: `<metrics-nav-menu-presentation
    [routerParams]="routerParams$ | async"
    (navigate)="routeMetricsGroupType($event)"
  ></metrics-nav-menu-presentation>`
})
export class NavMenuContainerComponent implements OnInit {
  routerParams$: Observable<RouterParams>;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.routerParams$ = this.store.pipe(select(selectRouter));
  }

  routeMetricsGroupType(params: { metricsType: MetricsType; group: GroupType }) {
    this.store.dispatch(ACTIONS.RouteMetricsGroupType({ metricsType: params.metricsType, group: params.group }));
  }
}
