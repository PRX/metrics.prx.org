import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { EpisodeSelectListComponent } from './episode-select-list.component';
import { FancyFormModule, SpinnerModule } from 'ngx-prx-styleguide';

import { episodes } from '@testing/downloads.fixtures';

describe('EpisodeSelectListComponent', () => {
  let comp: EpisodeSelectListComponent;
  let fix: ComponentFixture<EpisodeSelectListComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EpisodeSelectListComponent
      ],
      imports: [
        FancyFormModule,
        SpinnerModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(EpisodeSelectListComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;

      comp.episodes = episodes;
      fix.detectChanges();
    });
  }));

  it('should show list of episodes', () => {
    expect(de.queryAll(By.css('prx-checkbox')).length).toEqual(episodes.length);
  });

  it('should show filter list by selected episdos', () => {
    comp.showingSelected = true;
    comp.selectedEpisodes = [episodes[0].guid];
    fix.detectChanges();
    expect(de.queryAll(By.css('prx-checkbox')).length).toEqual(1);
  });

  it('should show episodes as checked when selected', () => {
    comp.selectedEpisodes = [episodes[0].guid];
    fix.detectChanges();
    expect(de.queryAll(By.css('prx-checkbox'))[0].query(By.css('input')).nativeElement.checked).toBeTruthy();
  });

  it('should load episodes on scroll', done => {
    jest.spyOn(comp.loadEpisodes, 'emit');
    el.scrollTop = el.scrollHeight;
    el.addEventListener('scroll', (e) => {
      expect(comp.loadEpisodes.emit).toHaveBeenCalled();
      done();
    });
    el.dispatchEvent(new Event('scroll'));
  });
});
