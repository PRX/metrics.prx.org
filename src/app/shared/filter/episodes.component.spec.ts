import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SelectModule } from 'ngx-prx-styleguide';
import { EpisodesComponent } from './episodes.component';

import { reducers, PodcastModel } from '../../ngrx/reducers';

import { CmsAllPodcastEpisodeGuidsAction } from '../../ngrx/actions';
import { EpisodeModel } from '../../ngrx/model';

describe('EpisodesComponent', () => {
  let comp: EpisodesComponent;
  let fix: ComponentFixture<EpisodesComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const episodes: EpisodeModel[] = [
    {
      seriesId: 37800,
      id: 123,
      publishedAt: new Date(),
      title: 'A Pet Talk Episode',
      guid: 'abcdefg'
    },
    {
      seriesId: 37800,
      id: 124,
      publishedAt: new Date(),
      title: 'Another Pet Talk Episode',
      guid: 'gfedcba'
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EpisodesComponent
      ],
      imports: [
        SelectModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(EpisodesComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      comp.filter = {
        podcastSeriesId: episodes[0].seriesId,
        episodeIds: episodes.map(e => e.id)
      };
      comp.store.dispatch(new CmsAllPodcastEpisodeGuidsAction({episodes}));
      comp.ngOnChanges();
    });
  }));

  it('should initialize episode selections according to filter', () => {
    expect(comp.selected.length).toEqual(2);
    expect(comp.selected[0].id).toEqual(123);
    expect(comp.selected[1].id).toEqual(124);
  });

  it('should clear episode selections if podcast changes', () => {
    expect(comp.allEpisodeOptions.length).toEqual(2);
    comp.filter = {podcastSeriesId: 37801};
    comp.ngOnChanges();
    expect(comp.allEpisodeOptions.length).toEqual(0);
  });
});
