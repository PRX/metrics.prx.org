import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PodcastNavDropdownComponent } from './podcast-nav-dropdown.component';
import { PodcastNavListComponent } from './podcast-nav-list.component';

import { PodcastModel } from '../../ngrx';

describe('PodcastNavComponent', () => {
  let comp: PodcastNavDropdownComponent;
  let fix: ComponentFixture<PodcastNavDropdownComponent>;
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
        PodcastNavDropdownComponent,
        PodcastNavListComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(PodcastNavDropdownComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should show podcast title rather than dropdown if there is just one podcast', () => {
    comp.podcasts = [podcasts[0]];
    comp.selectedPodcast = podcasts[0];
    fix.detectChanges();
    expect(de.query(By.css('span')).nativeElement.innerText).toEqual((podcasts[0].title).toUpperCase());
  });

  it('should show a drop down of podcasts if there are multiple to choose from', () => {
    comp.podcasts = podcasts;
    comp.selectedPodcast = podcasts[0];
    fix.detectChanges();
    expect(de.query(By.css('.dropdown'))).toBeDefined();
    expect(de.query(By.css('.dropdown-button > button')).nativeElement.innerText).toContain((podcasts[0].title).toUpperCase());
  });
});
