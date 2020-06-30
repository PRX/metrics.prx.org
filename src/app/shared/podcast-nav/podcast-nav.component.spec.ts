import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { RouterStub } from '../../../testing/stub.router';
import { StoreModule, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

import { PodcastNavComponent } from './podcast-nav.component';
import { PodcastNavDropdownComponent } from './podcast-nav-dropdown.component';
import { PodcastNavListComponent } from './podcast-nav-list.component';

import { reducers, RootState } from '../../ngrx/reducers';

import { CustomRouterNavigationAction, RoutePodcastAction, CastlePodcastPageSuccessAction } from '../../ngrx/actions';
import { Podcast, RouterParams } from '../../ngrx';

describe('PodcastNavComponent', () => {
  let store: Store<RootState>;
  let comp: PodcastNavComponent;
  let fix: ComponentFixture<PodcastNavComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const podcasts: Podcast[] = [
    {
      id: '70',
      title: 'Pet Talks Daily'
    },
    {
      id: '72',
      title: 'Totally Not Pet Talks Daily'
    }
  ];
  const routerParams: RouterParams = {
    podcastId: podcasts[0].id
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PodcastNavComponent, PodcastNavDropdownComponent, PodcastNavListComponent],
      imports: [StoreModule.forRoot(reducers)],
      providers: [{ provide: Router, useValue: { router: new RouterStub() } }]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(PodcastNavComponent);
        comp = fix.componentInstance;
        fix.detectChanges();
        de = fix.debugElement;
        el = de.nativeElement;

        store = TestBed.get(Store);

        store.dispatch(new CustomRouterNavigationAction({ routerParams }));
        store.dispatch(new CastlePodcastPageSuccessAction({ page: 1, podcasts: podcasts.slice(0, 1), total: 1 }));
      });
  }));

  it('should set selected podcast according to routerParams', done => {
    comp.selectedPodcast$.pipe(first()).subscribe(result => {
      expect(result).toEqual(podcasts[0]);
      done();
    });
  });

  it('should update list of podcasts', done => {
    comp.podcasts$.pipe(first()).subscribe(result => {
      expect(result).toEqual([podcasts[0]]);
      done();
    });
  });

  it('should dispatch routing action when podcast is changed', () => {
    jest.spyOn(store, 'dispatch').mockImplementation(() => {});
    comp.onPodcastChange(podcasts[1]);
    expect(store.dispatch).toHaveBeenCalledWith(new RoutePodcastAction({ podcastId: podcasts[1].id }));
  });
});
