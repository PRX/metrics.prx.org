import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Env } from '../core/core.env';
import { GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOMETRO, getGroupName, RouterParams, Rank } from '../ngrx/index';
import { fromEvent } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { toGoogleDataTable } from '../shared/util/chart.util';

declare const google: any;

@Component({
  selector: 'metrics-geochart-map',
  template: `<div #geo></div>`
})

export class GeochartMapComponent implements OnInit, OnChanges, AfterViewInit {
  private static googleLoaded: boolean;
  @ViewChild('geo') el: ElementRef;
  @Input() routerParams: RouterParams;
  @Input() data: Rank[];
  @Input() nestedData: Rank[];
  windowSize: {width: number, height: number};
  colors = ['#e5f5fb', '#a6cee3', '#01a0dc', '#008fc5', '#0089bd', '#1f78b4'];

  ngOnInit() {
    if (!GeochartMapComponent.googleLoaded && Env.GOOGLE_API_KEY) {
      GeochartMapComponent.googleLoaded = true;
      google.charts.load('current', {
        packages: ['geochart'],
        mapsApiKey: Env.GOOGLE_API_KEY
      });
      google.charts.setOnLoadCallback(this.drawMap.bind(this));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.drawMap();
  }

  ngAfterViewInit() {
    this.windowSize = {width: window.innerWidth, height: window.innerHeight};
    this.drawMap();
    fromEvent(window, 'resize').pipe(
      map((event: Event) => {
        this.windowSize = {width: event.target['innerWidth'], height: event.target['innerHeight']};
        return this.windowSize;
      }),
      distinctUntilChanged()).subscribe(() => this.drawMap());
  }

  getMapWidthOrHeight(): {width?: number, height?: number} {
    if (this.windowSize && this.windowSize.width && this.windowSize.width <= 768) {
      return {width: this.windowSize.width - 40};
    } else {
      return {height: 320};
    }
  }

  drawMap() {
    if (GeochartMapComponent.googleLoaded && google.visualization) {
      const options = {
        displayMode: 'region',
        colorAxis: {colors: this.colors},
        legend: 'none',
        ...this.getMapWidthOrHeight()
      };

      let data;
      if (this.routerParams.group === GROUPTYPE_GEOCOUNTRY && this.routerParams.filter && this.nestedData) {
        options['region'] = this.routerParams.filter;
        options['resolution'] = 'provinces';
        data = toGoogleDataTable(this.nestedData, getGroupName(this.routerParams.metricsType, this.routerParams.group));
      } else if (this.routerParams.group === GROUPTYPE_GEOCOUNTRY && this.data) {
        options['region'] = 'world';
        data = toGoogleDataTable(this.data, getGroupName(this.routerParams.metricsType, this.routerParams.group));
      } else if (this.routerParams.group === GROUPTYPE_GEOMETRO && this.data) {
        options['region'] = 'US';
        options['resolution'] = 'metros';
        data = toGoogleDataTable(this.data, getGroupName(this.routerParams.metricsType, this.routerParams.group));
      }

      if (data) {
        const chart = new google.visualization.GeoChart(this.el.nativeElement);
        chart.draw(data, options);
      }
    }
  }
}
