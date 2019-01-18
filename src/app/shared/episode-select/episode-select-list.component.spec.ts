import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { EpisodeSelectListComponent } from './episode-select-list.component';
import { FancyFormModule, SpinnerModule } from 'ngx-prx-styleguide';

import { episodes } from '../../../testing/downloads.fixtures';

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
      comp.totalEpisodes = 111;
      fix.detectChanges();
    });
  }));

  describe('Accumulator', () => {
    it('should show selected episodes', () => {
      comp.selectedEpisodes = ['some-guid-just-one-episode-selected'];
      fix.detectChanges();
      expect(de.query(By.css('.accumulator')).nativeElement.textContent.trim()).toEqual('1 episode selected');
    });
  });

  describe('Reset button', () => {
    it('should say "Showing" when no episodes are selected and "Show" to return to select all/none', () => {
      comp.selectedEpisodes = [];
      fix.detectChanges();
      expect(de.query(By.css('prx-checkbox span:first-child')).nativeElement.textContent).toEqual('Showing');
      comp.selectedEpisodes = ['some-guid-just-one-episode-selected'];
      fix.detectChanges();
      expect(de.query(By.css('prx-checkbox span:first-child')).nativeElement.textContent).toEqual('Show');
    });

    it('should be checked when no episodes are selected', () => {
      comp.selectedEpisodes = [];
      fix.detectChanges();
      expect(de.query(By.css('prx-checkbox')).query(By.css('input')).nativeElement.checked).toBeTruthy();
    });
  });

  describe('Search list', () => {
    it('should show list of episodes', () => {
      expect(de.queryAll(By.css('prx-checkbox')).length).toEqual(episodes.length + 1);
    });

    it('should show episodes as checked when selected', () => {
      comp.selectedEpisodes = [episodes[0].guid];
      fix.detectChanges();
      expect(de.queryAll(By.css('prx-checkbox'))[1].query(By.css('input')).nativeElement.checked).toBeTruthy();
    });
  });
});
