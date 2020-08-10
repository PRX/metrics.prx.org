import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '@app/shared';
import { ListenersChartPresentationComponent } from './listeners-chart-presentation.component';
import { METRICSTYPE_LISTENERS, CHARTTYPE_LINE, INTERVAL_LASTWEEK } from '@app/ngrx';
import { mapMetricsToTimeseriesData, standardColor } from '@app/shared/util/chart.util';
import { routerParams, podDownloads } from '@testing/downloads.fixtures';

describe('ListenersChartPresentationComponent', () => {
  let comp: ListenersChartPresentationComponent;
  let fix: ComponentFixture<ListenersChartPresentationComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListenersChartPresentationComponent],
      imports: [RouterTestingModule, SharedModule]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(ListenersChartPresentationComponent);
        comp = fix.componentInstance;
        fix.detectChanges();
        de = fix.debugElement;
        el = de.nativeElement;

        comp.routerParams = {
          ...routerParams,
          metricsType: METRICSTYPE_LISTENERS,
          chartType: CHARTTYPE_LINE,
          interval: INTERVAL_LASTWEEK
        };
        comp.chartData = [{ label: 'Unique Listeners', data: mapMetricsToTimeseriesData(podDownloads), color: standardColor }];
        fix.detectChanges();
      });
  }));

  it('should show listeners chart', () => {
    expect(de.query(By.css('prx-timeseries-chart'))).not.toBeNull();
  });
});
