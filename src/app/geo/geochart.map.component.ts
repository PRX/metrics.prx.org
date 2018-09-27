import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Env } from '../core/core.env';
import { GROUPTYPE_GEOCOUNTRY, GROUPTYPE_GEOMETRO, RouterParams } from '../ngrx/index';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { map } from 'rxjs/operators/map';
import { distinctUntilChanged } from 'rxjs/operators';

declare const google: any;

@Component({
  selector: 'metrics-geochart-map',
  template: `<div #geo></div>`
})

export class GeochartMapComponent implements OnInit, OnChanges, AfterViewInit {
  private static googleLoaded: boolean;
  @ViewChild('geo') el: ElementRef;
  @Input() routerParams: RouterParams;
  @Input() data: any[][];
  @Input() nestedData: any[][];
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
    if (changes.data) {
      this.drawMap();
    }
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

  drawMap() {
    if (GeochartMapComponent.googleLoaded && google.visualization && this.data) {
      let width, height;
      if (this.windowSize && this.windowSize.width && this.windowSize.width <= 768) {
        width = this.windowSize.width - 40;
      } else {
        height = 320;
      }
      const options = {
        displayMode: 'region',
        colorAxis: {colors: this.colors},
        legend: 'none'
      };
      if (width) {
        options['width'] = width;
      }
      if (height) {
        options['height'] = height;
      }

      let data;
      /* TODO: other regions are not working yet, need to use region codes and format rows for displaying name,
      see https://developers.google.com/chart/interactive/docs/reference#DataTable
      if (this.routerParams.group === GROUPTYPE_GEOCOUNTRY && this.routerParams.filter && this.nestedData) {
        options['region'] = this.routerParams.filter;
        options['resolution'] = 'provinces';
        data = google.visualization.arrayToDataTable(this.nestedData);
      } else */
      if (this.routerParams.group === GROUPTYPE_GEOCOUNTRY) {
        options['region'] = 'world';
        data = google.visualization.arrayToDataTable(this.data);
      } else if (this.routerParams.group === GROUPTYPE_GEOMETRO) {
        options['region'] = 'US';
        options['resolution'] = 'metros';
        data = google.visualization.arrayToDataTable(this.data);
      }

      const chart = new google.visualization.GeoChart(this.el.nativeElement);
      chart.draw(data, options);
    }
  }
}
