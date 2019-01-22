import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { getColor } from '../util/chart.util';
import {
  podcastAgentNameRanks,
  routerParams as downloadParams
} from '../../../testing/downloads.fixtures';

import { TotalsTableComponent } from './totals-table.component';
import { LargeNumberPipe } from '../pipes/large-number.pipe';
import { FancyFormModule } from 'ngx-prx-styleguide';
import { MetricsType, GroupType, GROUPTYPE_AGENTNAME, METRICSTYPE_TRAFFICSOURCES } from '../../ngrx/reducers/models';

describe('TotalsTableComponent', () => {
  const routerParams = {...downloadParams, metricsType: <MetricsType>METRICSTYPE_TRAFFICSOURCES, group: <GroupType>GROUPTYPE_AGENTNAME};

  let comp: TotalsTableComponent;
  let fix: ComponentFixture<TotalsTableComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TotalsTableComponent,
        LargeNumberPipe
      ],
      imports: [
        FancyFormModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(TotalsTableComponent);
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
      comp.routerParams = routerParams;
      fix.detectChanges();
    });
  }));

  it('should show numRowsWithToggle || data.length + 1 for Others checkboxes', () => {
    const expected = comp.tableData.length < comp.numRowsWithToggle ? comp.tableData.length : comp.numRowsWithToggle + 1;
    expect(de.queryAll(By.css('prx-checkbox')).length).toEqual(expected);
  });

  it('should emit toggleEntry event when checkbox is clicked', () => {
    jest.spyOn(comp.toggleEntry, 'emit');
    const checkboxes = de.queryAll(By.css('input[type="checkbox"]'));
    checkboxes[0].nativeElement.click();
    expect(comp.toggleEntry.emit).toHaveBeenCalledWith(
      {group: routerParams.group, groupName: podcastAgentNameRanks[0].label, charted: false});
  });
});
