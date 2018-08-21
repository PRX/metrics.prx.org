import { Component, Input } from '@angular/core';
import { RouterParams, getGroupName } from '../../ngrx';

@Component({
  selector: 'metrics-type-heading',
  template: `<h1>{{getGroupName(routerParams.metricsType, routerParams.group)}}</h1>`,
  styleUrls: ['metrics-type-heading.component.css']
})

export class MetricsTypeHeadingComponent {
  @Input() routerParams: RouterParams;
  getGroupName = getGroupName;
}
