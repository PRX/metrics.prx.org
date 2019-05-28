import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { METRICSTYPE_DROPDAY } from '@app/ngrx';

import { EpisodeSelectDropdownButtonComponent } from './episode-select-dropdown-button.component';

describe('EpisodeSelectDropdownButtonComponent', () => {
  let comp: EpisodeSelectDropdownButtonComponent;
  let fix: ComponentFixture<EpisodeSelectDropdownButtonComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EpisodeSelectDropdownButtonComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(EpisodeSelectDropdownButtonComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should show number of selected episodes', () => {
    comp.totalEpisodes = 14;
    comp.selectedEpisodes = ['some-guid-just-one-episode-selected'];
    fix.detectChanges();
    expect(de.query(By.css('.dropdown-button span')).nativeElement.textContent.trim()).toContain('1 Episode Selected');
  });

  it('should total episodes or no episodes', () => {
    comp.totalEpisodes = 14;
    comp.selectedEpisodes = null;
    fix.detectChanges();
    expect(de.query(By.css('.dropdown-button span')).nativeElement.textContent.trim()).toEqual('All Episodes');
    comp.totalEpisodes = 0;
    fix.detectChanges();
    expect(de.query(By.css('div:first-child')).nativeElement.textContent.trim()).toEqual('No Episodes');

    comp.metricsType = METRICSTYPE_DROPDAY;
    comp.totalEpisodes = 14;
    fix.detectChanges();
  });
});
