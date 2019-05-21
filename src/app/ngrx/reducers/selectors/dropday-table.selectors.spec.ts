import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';

import { RootState, reducers } from '..';
import { METRICSTYPE_DROPDAY, CHARTTYPE_HORIZBAR, DownloadsTableModel } from '../models';
import { getTotal } from '@app/shared/util/metrics.util';
import * as dispatchHelper from '@testing/dispatch.helpers';
import { routerParams, episodes,
  ep0Downloads, ep1Downloads, ep0AllTimeDownloads, ep1AllTimeDownloads } from '@testing/downloads.fixtures';
import { selectDropdayTableMetrics } from './dropday-table.selectors';

describe('Dropday Table Selectors', () => {
  let store: Store<RootState>;
  let result: DownloadsTableModel[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers)
      ]
    });
    store = TestBed.get(Store);

    dispatchHelper.dispatchRouterNavigation(store, {...routerParams, metricsType: METRICSTYPE_DROPDAY, chartType: CHARTTYPE_HORIZBAR});
    dispatchHelper.dispatchEpisodePage(store);
    dispatchHelper.dispatchEpisodeSelectList(store);
    dispatchHelper.dispatchSelectEpisodes(store, routerParams.podcastId, METRICSTYPE_DROPDAY, [episodes[0].guid, episodes[1].guid]);
    dispatchHelper.dispatchEpisodeDropday(store);
    dispatchHelper.dispatchEpisodeAllTimeDownloads(store);

    store.pipe(select(selectDropdayTableMetrics)).subscribe((data) => {
      result = data;
    });
  });

  it('should get episodes with total and all time downloads sorted by publish date descending', () => {
    expect(result.length).toEqual(episodes.length);
    expect(episodes[0].publishedAt.valueOf()).toBeGreaterThanOrEqual(episodes[1].publishedAt.valueOf());
    expect(result[0].title).toEqual(episodes[0].title);
    expect(result[0].totalForPeriod).toEqual(getTotal(ep0Downloads));
    expect(result[0].allTimeDownloads).toEqual(ep0AllTimeDownloads.total);
    expect(result[1].title).toEqual(episodes[1].title);
    expect(result[1].totalForPeriod).toEqual(getTotal(ep1Downloads));
    expect(result[1].allTimeDownloads).toEqual(ep1AllTimeDownloads.total);
  });

});
