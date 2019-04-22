import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { SharedModule } from '@app/shared';
import { SummaryTableComponent } from './summary-table.component';

import { podcast, episodes } from '@testing/downloads.fixtures';
import { neutralColor, getColor } from '@app/shared/util/chart.util';
import { CHARTTYPE_STACKED } from '@app/ngrx';

describe('SummaryTableComponent', () => {
  let comp: SummaryTableComponent;
  let fix: ComponentFixture<SummaryTableComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SummaryTableComponent
      ],
      imports: [
        RouterTestingModule,
        FancyFormModule,
        SharedModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(SummaryTableComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;

      comp.chartType = CHARTTYPE_STACKED;
      comp.podcastTableData = {
        title: 'All Episodes',
        color: neutralColor,
        id: podcast.id,
        totalForPeriod: 0,
        charted: true
      };
      comp.episodeTableData = episodes.map((e, index) => {
        return {
          title: e.title,
          color: getColor(index),
          id: e.guid,
          totalForPeriod: 0,
          charted: true
        };
      });
      fix.detectChanges();
    });
  }));

  it('toggles episode display when checkbox is clicked', () => {
    jest.spyOn(comp.toggleChartEpisode, 'emit');
    const checks = de.queryAll(By.css('input[type="checkbox"]'));
    expect(checks.length).toEqual(3); // podcast + episodes
    checks[2].nativeElement.click();
    expect(comp.toggleChartEpisode.emit).toHaveBeenCalledWith({guid: episodes[1].guid, charted: false});
  });

  it('toggles podcast display when checkbox is clicked', () => {
    jest.spyOn(comp.toggleChartPodcast, 'emit');
    const checks = de.queryAll(By.css('input[type="checkbox"]'));
    checks[0].nativeElement.click();
    expect(comp.toggleChartPodcast.emit).toHaveBeenCalledWith(false);
  });
});
