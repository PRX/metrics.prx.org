import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FancyFormModule } from 'ngx-prx-styleguide';

import { SharedModule } from '../shared';
import { DownloadsTablePresentationComponent } from './downloads-table-presentation.component';

import { INTERVAL_HOURLY } from '../ngrx/reducers/models';
import { routerParams, podcast, episodes } from '../../testing/downloads.fixtures';
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
        FancyFormModule,
        SharedModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(DownloadsTablePresentationComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      comp.routerParams = routerParams;
      comp.podcastTableData = {
        title: 'All Episodes',
        color: neutralColor,
        id: podcast.feederId,
        downloads: [],
        totalForPeriod: 0,
        charted: true
      };
      comp.episodeTableData = episodes.map((e, index) => {
        return {
          title: e.title,
          color: getColor(index),
          id: e.guid,
          downloads: [],
          totalForPeriod: 0,
          charted: true
        };
      });
      fix.detectChanges();
    });
  }));

  it('should show message about local timezone translation for hourly data', () => {
    comp.routerParams = {...comp.routerParams, interval: INTERVAL_HOURLY};
    fix.detectChanges();
    expect(de.query(By.css('em')).nativeElement.textContent).toContain('local timezone');
  });

  it('toggles episode display when checkbox is clicked', () => {
    spyOn(comp.toggleChartEpisode, 'emit');
    const checks = de.queryAll(By.css('input[type="checkbox"]'));
    expect(checks.length).toEqual(3); // podcast + episodes
    checks[2].nativeElement.click();
    expect(comp.toggleChartEpisode.emit).toHaveBeenCalledWith({episodeId: episodes[1].guid, charted: false});
  });
});
