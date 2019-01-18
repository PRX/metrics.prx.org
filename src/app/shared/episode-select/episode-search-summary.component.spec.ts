import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { EpisodeSearchSummaryComponent } from './episode-search-summary.component';

describe('EpisodeSearchSummaryComponent', () => {
  let comp: EpisodeSearchSummaryComponent;
  let fix: ComponentFixture<EpisodeSearchSummaryComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EpisodeSearchSummaryComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(EpisodeSearchSummaryComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should show number of episodes matching search term', () => {
    comp.searchTotal = 14;
    fix.detectChanges();
    expect(el.textContent.trim()).toEqual('(14 episodes)');
  });

  it('should indicate no results', () => {
    comp.searchTotal = 0;
    fix.detectChanges();
    expect(el.textContent.trim()).toEqual('(no results)');
  });
});
