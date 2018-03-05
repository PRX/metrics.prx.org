import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '../shared';
import { DownloadsTablePresentationComponent } from './downloads-table-presentation.component';

import { INTERVAL_HOURLY } from '../ngrx/reducers/models';
import { routerState, podcast, episodes } from '../../testing/downloads.fixtures';
import { neutralColor, getColor } from '../shared/util/chart.util';

describe('DownloadsTablePresentationComponent', () => {
  let comp: DownloadsTablePresentationComponent;
  let fix: ComponentFixture<DownloadsTablePresentationComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadsTablePresentationComponent
      ],
      imports: [
        RouterTestingModule,
        SharedModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsTablePresentationComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      comp.routerState = routerState;
      comp.podcastTableData = {
        title: 'All Episodes',
        color: neutralColor,
        id: podcast.seriesId,
        downloads: [],
        totalForPeriod: 0,
        charted: true
      };
      comp.episodeTableData = episodes.map((e, index) => {
        return {
          title: e.title,
          color: getColor(episodes.length, index),
          id: e.id,
          downloads: [],
          totalForPeriod: 0,
          charted: true
        };
      });
    });
  }));

  it('should show message about local timezone translation for hourly data', () => {
    comp.routerState.interval = INTERVAL_HOURLY;
    fix.detectChanges();
    expect(de.query(By.css('em')).nativeElement.textContent).toContain('local timezone');
  });

  it('toggles episode display when checkbox is clicked', () => {
    spyOn(comp.toggleChartEpisode, 'emit');
    const checks = de.queryAll(By.css('input[type="checkbox"]'));
    expect(checks.length).toEqual(3);
    checks[2].nativeElement.click();
    expect(comp.toggleChartEpisode.emit).toHaveBeenCalledWith({episodeId: 123, charted: true});
  });
});
