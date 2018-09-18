import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { getColor } from '../util/chart.util';
import {
  podcastAgentNameRanks,
  routerParams as downloadParams
} from '../../../testing/downloads.fixtures';

import { NestedTotalsTableComponent } from './nested-totals-table.component';
import { LargeNumberPipe } from '../pipes/large-number.pipe';
import { ErrorRetryComponent } from '../error/error-retry.component';
import { SpinnerModule } from 'ngx-prx-styleguide';
import {
  MetricsType,
  GroupType,
  GROUPTYPE_GEOCOUNTRY,
  METRICSTYPE_DEMOGRAPHICS
} from '../../ngrx/reducers/models';

describe('NestedTotalsTableComponent', () => {
  const routerParams = {...downloadParams, metricsType: <MetricsType>METRICSTYPE_DEMOGRAPHICS, group: <GroupType>GROUPTYPE_GEOCOUNTRY};

  let comp: NestedTotalsTableComponent;
  let fix: ComponentFixture<NestedTotalsTableComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NestedTotalsTableComponent,
        ErrorRetryComponent,
        LargeNumberPipe
      ],
      imports: [
        SpinnerModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(NestedTotalsTableComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;

      const total = podcastAgentNameRanks.reduce((acc, rank) => acc += rank.total, 0);
      comp.tableData = podcastAgentNameRanks.map((rank, i) => {
        return {
          color: getColor(i),
          label: rank.label,
          code: rank.code,
          value: rank.total,
          percent: rank.total / total,
          charted: i < 10
        };
      });
      comp.nestedData = podcastAgentNameRanks.map((rank, i) => {
        return {
          color: getColor(i),
          label: rank.label,
          code: rank.code,
          value: rank.total
        };
      });
      comp.routerParams = routerParams;
      fix.detectChanges();
    });
  }));

  it('should emit discloseNestedData event when disclosure triangle or label is clicked', () => {
    spyOn(comp.discloseNestedData, 'emit').and.callThrough();
    const checkboxes = de.queryAll(By.css('input[type="checkbox"]'));
    checkboxes[0].nativeElement.click();
    expect(comp.discloseNestedData.emit).toHaveBeenCalledWith(comp.tableData[0].code);
  });
});
