import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { StoreModule, Store } from '@ngrx/store';
import { RouterStub } from '../../../testing/stub.router';
import { DebugElement } from '@angular/core';

import { PodcastNavComponent } from './podcast-nav.component';
import { PodcastNavDropdownComponent } from './podcast-nav-dropdown.component';
import { PodcastNavListComponent } from './podcast-nav-list.component';

import { reducers, RootState } from '../../ngrx/reducers';

import { CustomRouterNavigationAction, CmsPodcastsSuccessAction } from '../../ngrx/actions';
import { RouterModel } from '../../ngrx';

describe('PodcastNavComponent', () => {
  let store: Store<RootState>;
  let comp: PodcastNavComponent;
  let fix: ComponentFixture<PodcastNavComponent>;
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
  const routerState: RouterModel = {
    podcastSeriesId: podcasts[0].seriesId
  };
  const event = {
    id: -1,
    url: '/37800',
    urlAfterRedirects: '/37800'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PodcastNavComponent,
        PodcastNavDropdownComponent,
        PodcastNavListComponent
      ],
      imports: [
        StoreModule.forRoot(reducers)
      ],
      providers: [
        {provide: Router, useValue: {router: new RouterStub()}}
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(PodcastNavComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      store = TestBed.get(Store);

      store.dispatch(new CustomRouterNavigationAction({routerState, event}));
      store.dispatch(new CmsPodcastsSuccessAction({podcasts: podcasts.slice(0, 1)}));
    });
  }));

  it('should initialize selected podcast according to filter', () => {
    let result;
    comp.selectedPodcast$.subscribe(value => result = value);
    expect(result).toEqual(podcasts[0]);
  });

  it('should update list of podcasts', () => {
    let result;
    comp.podcasts$.subscribe(value => result = value);
    expect(result).toEqual([podcasts[0]]);
    store.dispatch(new CmsPodcastsSuccessAction({podcasts: podcasts}));
    expect(result).toEqual(podcasts);
  });
});
