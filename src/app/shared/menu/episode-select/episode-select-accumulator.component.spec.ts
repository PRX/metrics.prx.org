import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { EpisodeSelectAccumulatorComponent } from './episode-select-accumulator.component';

describe('EpisodeSelectAccumulatorComponent', () => {
  let comp: EpisodeSelectAccumulatorComponent;
  let fix: ComponentFixture<EpisodeSelectAccumulatorComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EpisodeSelectAccumulatorComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(EpisodeSelectAccumulatorComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should show selected episodes', () => {
    comp.selectedEpisodes = ['some-guid-just-one-episode-selected'];
    fix.detectChanges();
    expect(de.query(By.css('.accumulator')).nativeElement.textContent.trim()).toContain('1 episode selected');
  });

  it('should total episodes', () => {
    comp.totalEpisodes = 14;
    comp.selectedEpisodes = ['some-guid-just-one-episode-selected'];
    fix.detectChanges();
    expect(de.query(By.css('div:first-child')).nativeElement.textContent.trim()).toEqual('14 episodes');
    expect(de.query(By.css('div:first-child')).nativeElement.classList).toContain('muted');
  });
});
