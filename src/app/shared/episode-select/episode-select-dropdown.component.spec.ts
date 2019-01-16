import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';

import { EpisodeSelectDropdownComponent } from './episode-select-dropdown.component';
import { EpisodeSearchComponent } from './episode-search.component';
import { EpisodeSearchSummaryComponent } from './episode-search-summary.component';
import { EpisodeSelectListComponent } from './episode-select-list.component';
import { FancyFormModule, SpinnerModule } from 'ngx-prx-styleguide';

import { episodes } from '../../../testing/downloads.fixtures';
import { EPISODE_SELECT_PAGE_SIZE } from '../../ngrx';
import * as ACTIONS from '../../ngrx/actions';
import { reducers } from '../../ngrx/reducers';

describe('EpisodeSelectDropdownComponent', () => {
  let comp: EpisodeSelectDropdownComponent;
  let fix: ComponentFixture<EpisodeSelectDropdownComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EpisodeSelectDropdownComponent,
        EpisodeSearchComponent,
        EpisodeSearchSummaryComponent,
        EpisodeSelectListComponent
      ],
      imports: [
        FancyFormModule,
        SpinnerModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(EpisodeSelectDropdownComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);

      comp.episodes = new Array(EPISODE_SELECT_PAGE_SIZE).fill(episodes[0]);
      comp.totalEpisodes = comp.episodes.length + 10;
      comp.searchTotal = comp.episodes.length;
      comp.lastPage = 1;
      comp.maxPages = 2;
      fix.detectChanges();

      spyOn(comp, 'loadEpisodes').and.callThrough();
      spyOn(store, 'dispatch');
    });
  }));

  it('should load episodes on dropdown scroll', () => {
    comp.dropdownContent.nativeElement.scrollTop = comp.dropdownContent.nativeElement.scrollHeight;
    comp.dropdownContent.nativeElement.dispatchEvent(new Event('scroll'));
    expect(comp.loadEpisodes).toHaveBeenCalledWith(comp.lastPage + 1, comp.searchTerm);
    expect(store.dispatch).toHaveBeenCalledWith(
      new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'episode-select-page-load', value: comp.lastPage + 1}));
  });

  it('should load episodes on search', () => {
    comp.loadEpisodesOnSearch('search term');
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.CastleEpisodeSelectPageLoadAction({
      podcastId: comp.podcastId,
      page: 1,
      per: EPISODE_SELECT_PAGE_SIZE,
      search: 'search term'
    }));
    expect(store.dispatch).toHaveBeenCalledWith(
      new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'episode-select-search'}));
  });

  it('dispatches selected episodes', () => {
    comp.onToggleSelectEpisode(episodes[0]);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.EpisodeSelectEpisodesAction({episodeGuids: [episodes[0].guid]}));
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.GoogleAnalyticsEventAction({gaAction: 'episode-select', value: 1}));
    comp.onToggleSelectEpisode(null);
    expect(store.dispatch).toHaveBeenCalledWith(new ACTIONS.EpisodeSelectEpisodesAction({episodeGuids: []}));
  });
});
