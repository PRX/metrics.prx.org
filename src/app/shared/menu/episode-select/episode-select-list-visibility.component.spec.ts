import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { EpisodeSelectListVisibilityComponent } from './episode-select-list-visibility.component';

describe('EpisodeSelectListVisibilityComponent', () => {
  let comp: EpisodeSelectListVisibilityComponent;
  let fix: ComponentFixture<EpisodeSelectListVisibilityComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EpisodeSelectListVisibilityComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(EpisodeSelectListVisibilityComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should disable show selected when no no episodes are selected', () => {
    comp.selectedEpisodes = [];
    fix.detectChanges();
    expect(de.query(By.css('button[disabled]'))).not.toBeNull();
  });
});
