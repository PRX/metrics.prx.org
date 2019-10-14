import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import { first } from 'rxjs/operators';

import * as fromEpisodeDownloads from './episode-downloads.selectors';
import { RootState, reducers } from '..';
import { EpisodeDownloads } from '../models';
import * as dispatchHelper from '../../../../testing/dispatch.helpers';
import * as fixtures from '../../../../testing/downloads.fixtures';

describe('Episode Downloads Selectors', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers)
      ]
    });
    store = TestBed.get(Store);

    dispatchHelper.dispatchRouterNavigation(store);
    dispatchHelper.dispatchEpisodePage(store);
    dispatchHelper.dispatchEpisodeDownloads(store);
  });

  it('should have routed episode downloads', done => {
    store.pipe(select(fromEpisodeDownloads.selectRoutedEpisodePageDownloads), first()).subscribe((epDownloads: EpisodeDownloads[]) => {
      expect(epDownloads.length).toEqual(fixtures.episodes.length);
      done();
    });
  });

});
