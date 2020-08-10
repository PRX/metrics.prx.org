import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import { first } from 'rxjs/operators';

import { RootState, reducers } from '../';
import { CHARTTYPE_LINE, METRICSTYPE_LISTENERS, INTERVAL_LASTWEEK } from '../models';
import * as dispatchHelper from '@testing/dispatch.helpers';
import { routerParams, podcast, podDownloads } from '@testing/downloads.fixtures';
import { selectRoutedPodcastListeners } from './podcast-listeners.selectors';

describe('Podcast Listeners Selectors', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers)]
    });
    store = TestBed.get(Store);

    dispatchHelper.dispatchRouterNavigation(store, {
      ...routerParams,
      metricsType: METRICSTYPE_LISTENERS,
      chartType: CHARTTYPE_LINE,
      interval: INTERVAL_LASTWEEK
    });
    dispatchHelper.dispatchPodcastListeners(store, podcast.id, podDownloads);
  });

  it('should get routed podcast listeners', done => {
    store.pipe(select(selectRoutedPodcastListeners), first()).subscribe(listeners => {
      expect(listeners).toBeDefined();
      expect(listeners.listeners.length).toEqual(podDownloads.length);
      done();
    });
  });
});
