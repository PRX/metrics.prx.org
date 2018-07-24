import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { StoreModule, Store } from '@ngrx/store';
import { RouterStub } from '../../../testing/stub.router';
import { DebugElement } from '@angular/core';

import { PodcastNavComponent } from './podcast-nav.component';
import { PodcastNavDropdownComponent } from './podcast-nav-dropdown.component';
import { PodcastNavListComponent } from './podcast-nav-list.component';

import { reducers, RootState } from '../../ngrx/reducers';

import { CustomRouterNavigationAction, CmsPodcastsSuccessAction, RoutePodcastAction } from '../../ngrx/actions';
import { RouterParams } from '../../ngrx';

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
  const routerParams: RouterParams = {
    podcastId: podcasts[0].feederId,
    podcastSeriesId: podcasts[0].seriesId
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

      store.dispatch(new CustomRouterNavigationAction({routerState: routerParams}));
      store.dispatch(new CmsPodcastsSuccessAction({podcasts: podcasts.slice(0, 1)}));
    });
  }));

  it('should set selected podcast according to routerParams', () => {
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

  it('should dispatch routing action when podcast is changed', () => {
    spyOn(store, 'dispatch');
    comp.onPodcastChange(podcasts[1]);
    expect(store.dispatch).toHaveBeenCalledWith(
      new RoutePodcastAction({podcastId: podcasts[1].feederId, podcastSeriesId: podcasts[1].seriesId}));
  });
});
