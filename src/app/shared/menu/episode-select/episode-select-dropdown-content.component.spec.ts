import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { By } from '@angular/platform-browser';

import { EpisodeSelectDropdownContentComponent } from './episode-select-dropdown-content.component';
import { EpisodeSearchComponent } from './episode-search.component';
import { EpisodeSelectAccumulatorComponent } from './episode-select-accumulator.component';
import { EpisodeSelectListComponent } from './episode-select-list.component';
import { EpisodeSelectListVisibilityComponent } from './episode-select-list-visibility.component';
import { FancyFormModule, SpinnerModule } from 'ngx-prx-styleguide';

import { episodes, routerParams } from '../../../../testing/downloads.fixtures';
import { EPISODE_SELECT_PAGE_SIZE } from '../../../ngrx';
import * as ACTIONS from '../../../ngrx/actions';
import { reducers } from '../../../ngrx/reducers';

describe('EpisodeSelectDropdownContentComponent', () => {
  let comp: EpisodeSelectDropdownContentComponent;
  let fix: ComponentFixture<EpisodeSelectDropdownContentComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EpisodeSelectDropdownContentComponent,
        EpisodeSearchComponent,
        EpisodeSelectAccumulatorComponent,
        EpisodeSelectListVisibilityComponent,
        EpisodeSelectListComponent
      ],
      imports: [
        FancyFormModule,
        SpinnerModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(EpisodeSelectDropdownContentComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);

      comp.routerParams = routerParams;
      comp.episodes = new Array(EPISODE_SELECT_PAGE_SIZE).fill(episodes[0]);
      comp.totalEpisodes = comp.episodes.length + 10;
      comp.searchTotal = comp.episodes.length;
      comp.lastPage = 1;
      comp.maxPages = 2;
      fix.detectChanges();

      jest.spyOn(comp, 'loadEpisodes');
      jest.spyOn(store, 'dispatch');
    });
  }));

  it('should load episodes on scroll if not reached max pages', () => {
    comp.loadEpisodesOnScroll();
    expect(comp.loadEpisodes).toHaveBeenCalledWith(comp.lastPage + 1, comp.searchTerm);
    expect(store.dispatch).toHaveBeenCalledWith(
      new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'episode-select-page-load', value: comp.lastPage + 1}));
    comp.lastPage = 2;
    comp.maxPages = 2;
    fix.detectChanges();
    comp.loadEpisodesOnScroll();
    expect(comp.loadEpisodes).toHaveBeenCalledTimes(1);
  });

  it('should load episodes on search', () => {
    comp.loadEpisodesOnSearch('search term');
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.CastleEpisodeSelectPageLoadAction({
      podcastId: routerParams.podcastId,
      page: 1,
      per: EPISODE_SELECT_PAGE_SIZE,
      search: 'search term'
    }));
    expect(store.dispatch).toHaveBeenCalledWith(
      new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'episode-select-search'}));
  });

  it('should dispatch selected episodes', () => {
    comp.onToggleSelectEpisode(episodes[0]);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.EpisodeSelectEpisodesAction({episodeGuids: [episodes[0].guid]}));
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'episode-select', value: 1}));
    comp.selectedEpisodes = [episodes[0].guid];
    comp.onToggleSelectEpisode(episodes[0]);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.EpisodeSelectEpisodesAction({episodeGuids: []}));
  });

  it('should show no results if finished searching and there are no episodes', () => {
    comp.episodesLoading = false;
    comp.searchTerm = 'no match';
    comp.searchTotal = 0;
    fix.detectChanges();
    expect(de.query(By.css('.dropdown-content')).nativeElement.textContent.trim()).toContain('(no results)');
  });

  it('should dispatch to reset selection and load podcast data', () => {
    comp.resetSelection();
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.CastlePodcastRanksLoadAction({
      id: routerParams.podcastId,
      group: routerParams.group,
      interval: routerParams.interval,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate
    }));
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.CastlePodcastTotalsLoadAction({
      id: routerParams.podcastId,
      group: routerParams.group,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate
    }));
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.EpisodeSelectEpisodesAction({episodeGuids: null}));
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'episode-select-reset'}));
  });
});
