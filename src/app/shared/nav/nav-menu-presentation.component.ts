import { Component, Input, Output, EventEmitter, OnChanges, HostListener } from '@angular/core';
import {
  RouterParams, GroupType, getGroupName,
  MetricsType, METRICSTYPE_DOWNLOADS, METRICSTYPE_TRAFFICSOURCES, METRICSTYPE_DEMOGRAPHICS,
  GROUPTYPE_AGENTOS, GROUPTYPE_AGENTTYPE, GROUPTYPE_AGENTNAME, GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOMETRO, GROUPTYPE_GEOSUBDIV
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
              <li *ngFor="let group of t.groups">
                <button
                  (click)="routeMetricsGroupType(t.type, group)" class="nav"
                  [class.active]="routerParams.metricsType === t.type && (routerParams.group === group || group === '')">
                  {{getGroupName(t.type, group)}}</button>
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
      groups: ['']
    },
    {type: METRICSTYPE_DEMOGRAPHICS, icon: '/assets/images/ic_globe_grey-darkest.svg', expanded: false,
      groups: [GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOMETRO]
    },
    {type: METRICSTYPE_TRAFFICSOURCES, icon: '/assets/images/ic_smartphone_grey-darkest.svg', expanded: false,
      groups: [GROUPTYPE_AGENTOS, GROUPTYPE_AGENTTYPE, GROUPTYPE_AGENTNAME]
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
    this.types.forEach(t => {
      if (t.type === this.routerParams.metricsType) {
        t.expanded = true;
      } else {
        t.expanded = false;
      }
    });
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
    return this.types.find(t => t.type === metricsType);
  }
}
