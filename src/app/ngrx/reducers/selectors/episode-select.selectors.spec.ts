import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';

import { selectNumEpisodeSelectPages, selectRoutedPodcastEpisodesSelectList } from './episode-select.selectors';
import { RootState, reducers } from '../';
import { EPISODE_SELECT_PAGE_SIZE, Episode } from '../models';
import * as ACTIONS from '../../actions';
import { routerParams, episodes } from '../../../../testing/downloads.fixtures';

describe('Episode Select List Selectors', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers)
      ]
    });
    store = TestBed.get(Store);

    store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));
    store.dispatch(
      new ACTIONS.CastleEpisodeSelectPageSuccessAction({page: 1, per: EPISODE_SELECT_PAGE_SIZE, total: 1001, episodes}));
  });

  it('determines total pages from total and page size', () => {
    store.pipe(select(selectNumEpisodeSelectPages)).subscribe((numPages: number) => {
      expect(numPages).toEqual(11);
    });
  });

  it('sorts routed podcast episodes by publish date', () => {
    store.pipe(select(selectRoutedPodcastEpisodesSelectList)).subscribe((eps: Episode[]) => {
      expect(eps.length).toEqual(episodes.filter(e => e.podcastId === '70').length);
      expect(eps[0].publishedAt.valueOf()).toBeGreaterThan(eps[1].publishedAt.valueOf());
    });
  });

});
