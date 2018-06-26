import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PodcastNavListComponent } from './podcast-nav-list.component';

import { PodcastModel } from '../../ngrx';

describe('PodcastNavComponent', () => {
  let comp: PodcastNavListComponent;
  let fix: ComponentFixture<PodcastNavListComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const podcasts: PodcastModel[] = [
    {
      seriesId: 37800,
      title: 'Pet Talks Daily',
      feederId: '70'
    },
    {
      seriesId: 37801,
      title: 'Totally Not Pet Talks Daily',
      feederId: '72'
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PodcastNavListComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(PodcastNavListComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      comp.podcasts = podcasts;
      comp.selectedPodcast = podcasts[0];
      fix.detectChanges();

      spyOn(comp.podcastChange, 'emit').and.callThrough();
    });
  }));

  it('should show list of podcast buttons', () => {
    const buttons = de.queryAll(By.css('button'));
    expect(buttons.length).toEqual(podcasts.length);
    expect(buttons[0].nativeElement.innerText).toEqual(podcasts[0].title);
  });

  it('should show active podcast in list', () => {
    const activeButton = de.query(By.css('button.active'));
    expect(activeButton).toBeDefined();
    expect(activeButton.nativeElement.innerText).toEqual(comp.selectedPodcast.title);
  });

  it('should emit podcastChange event when a podcast other than the selectedPodcast is chosen', () => {
    const activeButton = de.query(By.css('button.active'));
    activeButton.nativeElement.click();
    expect(comp.podcastChange.emit).not.toHaveBeenCalled();
    const inactiveButtons = de.queryAll(By.css('button:not(.active)'));
    inactiveButtons[0].nativeElement.click();
    expect(comp.podcastChange.emit).toHaveBeenCalled();
  });

  it('should handle selection of podcast if list is available but none is currently selected', () => {
    comp.podcasts = podcasts;
    comp.selectedPodcast = undefined;
    expect(() => comp.onPodcastChange(podcasts[0])).not.toThrow();
    expect(comp.podcastChange.emit).toHaveBeenCalled();
  });
});
