import { Component, Input, Output, EventEmitter, OnChanges, HostListener } from '@angular/core';
import {
  RouterParams, GroupType, getGroupName,
  MetricsType, METRICSTYPE_DOWNLOADS, METRICSTYPE_DROPDAY, METRICSTYPE_TRAFFICSOURCES, METRICSTYPE_DEMOGRAPHICS,
  GROUPTYPE_AGENTOS, GROUPTYPE_AGENTTYPE, GROUPTYPE_AGENTNAME, GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOMETRO,
} from '../../ngrx/';

@Component({
  selector: 'metrics-nav-menu-presentation',
  template: `
    <div class="dropdown" [class.open]="open">
      <div class="overlay" (click)="toggleOpen()"></div>
      <div class="dropdown-button">
        <button (click)="toggleOpen()">
          <span class="nav-label">
            <img class="icon" [src]="getTypeWithIcon(routerParams.metricsType)?.icon" [alt]="routerParams.metricsType">
            <span
              [class]="" aria-hidden="true"></span>
            <span class="text">{{getGroupName(routerParams.metricsType, routerParams.group)}}</span>
          </span>
          <span class="down-arrow"></span>
        </button>
      </div>
      <div class="dropdown-content rollout">
        <nav>
          <li *ngFor="let t of types">
            <button class="section" (click)="accordionMetricsType(t.type)">
              <img class="icon" [src]="t.icon" aria-hidden="true">
              <span class="text">{{t.type}}</span>
            </button>
            <ul *ngIf="t.expanded">
              <li *ngFor="let g of t.groups">
                <button
                  (click)="routeMetricsGroupType(g.type, g.group)" class="nav"
                  [class.active]="routerParams.metricsType === g.type && (!g.group || routerParams.group === g.group)">
                  {{getGroupName(g.type, g.group)}}</button>
              </li>
            </ul>
          </li>
        </nav>
      </div>
    </div>
  `,
  styleUrls: ['nav-menu-presentation.component.css']
})
export class NavMenuPresentationComponent implements OnChanges {
  @Input() routerParams: RouterParams;
  @Output() navigate = new EventEmitter();
  types = [
    {type: METRICSTYPE_DOWNLOADS, icon: '/assets/images/ic_headphones_grey-darkest.svg', expanded: false,
      groups: [
        {type: METRICSTYPE_DOWNLOADS},
        {type: METRICSTYPE_DROPDAY}
      ]
    },
    {type: METRICSTYPE_DEMOGRAPHICS, icon: '/assets/images/ic_globe_grey-darkest.svg', expanded: false,
      groups: [
        {type: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY},
        {type: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOMETRO}
      ]
    },
    {type: METRICSTYPE_TRAFFICSOURCES, icon: '/assets/images/ic_smartphone_grey-darkest.svg', expanded: false,
      groups: [
        {type: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTOS},
        {type: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTTYPE},
        {type: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTNAME}
      ]
    }
  ];
  getGroupName = getGroupName;
  open = false;
  @HostListener('window: scroll', [])
  onWindowScroll() {
    this.open = false;
  }

  ngOnChanges() {
    this.initAccordion();
  }

  initAccordion() {
    for (const t of this.types) {
      for (const g of t.groups) {
        if (g.type === this.routerParams.metricsType) {
          t.expanded = true; // set to open, otherwise closed
        }
      }
    }
  }

  routeMetricsGroupType(metricsType: MetricsType, group: GroupType) {
    this.open = false;
    this.navigate.emit({metricsType, group});
  }

  accordionMetricsType(metricsType: MetricsType) {
    this.types.forEach(t => {
      if (t.type === metricsType) {
        t.expanded = !t.expanded;
      } else {
        t.expanded = false;
      }
    });
  }

  toggleOpen() {
    this.open = !this.open;
    if (this.open) {
      this.initAccordion();
    }
  }

  getTypeWithIcon(metricsType: MetricsType) {
    return this.types.find(t => (<any[]>t.groups).find(g => g.type === metricsType));
  }
}
