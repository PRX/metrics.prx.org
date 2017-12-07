import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterStub } from '../../../testing/stub.router';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SelectModule } from 'ngx-prx-styleguide';
import { PodcastsComponent } from './podcasts.component';

import { reducers } from '../../ngrx/reducers';

import { CastleFilterAction, CmsPodcastsAction } from '../../ngrx/actions';
import { FilterModel } from '../../ngrx/model';

describe('PodcastsComponent', () => {
  let comp: PodcastsComponent;
  let fix: ComponentFixture<PodcastsComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const podcasts = [
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
  const filter: FilterModel = {
    podcastSeriesId: podcasts[0].seriesId
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PodcastsComponent
      ],
      imports: [
        SelectModule,
        StoreModule.forRoot(reducers)
      ],
      providers: [
        {provide: Router, useValue: {router: new RouterStub()}}
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(PodcastsComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      comp.store.dispatch(new CastleFilterAction({filter}));
      comp.store.dispatch(new CmsPodcastsAction({podcasts: podcasts.slice(0, 1)}));
    });
  }));

  it('should initialize selected podcast according to filter', () => {
    expect(comp.selectedPodcastSeriesId).toEqual(podcasts[0].seriesId);
  });

  it('should show podcast title rather than dropdown if there is just one podcast', () => {
    expect(comp.allPodcastOptions.length).toEqual(1);
    expect(comp.selectedPodcast.title).toEqual(podcasts[0].title);
    fix.detectChanges();
    expect(de.query(By.css('span')).nativeElement.innerText).toEqual(podcasts[0].title);
  });

  it('should show a drop down of podcasts if there are multiple to choose from', () => {
    comp.store.dispatch(new CmsPodcastsAction({podcasts}));
    expect(de.query(By.css('prx-select'))).toBeDefined();
    expect(comp.allPodcastOptions.length).toEqual(2);
  });
});
