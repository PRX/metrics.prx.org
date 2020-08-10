import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { RootState, reducers } from '../';
import { CHARTTYPE_LINE, METRICSTYPE_LISTENERS, INTERVAL_LASTWEEK } from '../models';
import { TimeseriesChartModel } from 'ngx-prx-styleguide';
import * as dispatchHelper from '@testing/dispatch.helpers';
import { routerParams, podcast, podDownloads } from '@testing/downloads.fixtures';
import { selectListenersChartMetrics } from './listeners-chart.selectors';

describe('Listeners Chart Selectors', () => {
  let store: Store<RootState>;
  let result: TimeseriesChartModel[];
  let dataSub: Subscription;

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

    dataSub = store.pipe(select(selectListenersChartMetrics)).subscribe(data => {
      result = <TimeseriesChartModel[]>data;
    });
  });

  afterEach(() => {
    dataSub.unsubscribe();
  });

  it('should select podcast listeners chart data', () => {
    expect(result[0].label).toEqual('Unique Listeners');
    expect(result[0].data.length).toEqual(podDownloads.length);
  });
});
