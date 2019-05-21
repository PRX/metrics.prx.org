import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, select } from '@ngrx/store';

import { RootState, reducers } from '../';
import { CHARTTYPE_EPISODES, METRICSTYPE_DROPDAY, CHARTTYPE_HORIZBAR } from '../models';
import { getTotal } from '@app/shared/util/metrics.util';
import { CategoryChartModel, IndexedChartModel } from 'ngx-prx-styleguide';
import * as dispatchHelper from '@testing/dispatch.helpers';
import { routerParams, episodes, ep0Downloads, ep1Downloads } from '@testing/downloads.fixtures';
import { selectDropdayChartMetrics } from './dropday-chart.selectors';

describe('Dropday Chart Selectors', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers)
      ]
    });
    store = TestBed.get(Store);
  });

  describe('horizontal bar episode chart', () => {
    let result: CategoryChartModel[];

    beforeEach(() => {
      dispatchHelper.dispatchRouterNavigation(store, {...routerParams, metricsType: METRICSTYPE_DROPDAY, chartType: CHARTTYPE_HORIZBAR});
      dispatchHelper.dispatchEpisodePage(store);
      dispatchHelper.dispatchEpisodeSelectList(store);
      dispatchHelper.dispatchSelectEpisodes(store, [episodes[0].guid, episodes[1].guid]);
      dispatchHelper.dispatchEpisodeDropday(store);

      store.pipe(select(selectDropdayChartMetrics)).subscribe((data) => {
        result = <CategoryChartModel[]>data;
      });
    });

    it('should get episodes with totals sorted by total value descending', () => {
      expect(result.length).toEqual(episodes.length);
      expect(result[0].label).toEqual(episodes[1].title);
      expect(result[0].value).toEqual(getTotal(ep1Downloads));
      expect(result[1].label).toEqual(episodes[0].title);
      expect(result[1].value).toEqual(getTotal(ep0Downloads));
      expect(result[0].value).toBeGreaterThanOrEqual(result[1].value);
    });

    it('should only include selected episodes', () => {
      expect(result.length).toEqual(episodes.length);
      dispatchHelper.dispatchSelectEpisodes(store, [episodes[0].guid]);
      expect(result.length).toEqual(1);
    });

    it('should truncate long episode titles for chart', () => {
      dispatchHelper.dispatchEpisodeSelectList(store, [{...episodes[1], title: 'a pretty long title with a lot of words'}]);
      dispatchHelper.dispatchSelectEpisodes(store, [episodes[1].guid]);
      expect(result[0].label.length).toBeLessThanOrEqual(32);
    });
  });

  describe('cumulative line episode chart', () => {
    let result: IndexedChartModel[];

    beforeEach(() => {
      dispatchHelper.dispatchRouterNavigation(store, {...routerParams, metricsType: METRICSTYPE_DROPDAY, chartType: CHARTTYPE_EPISODES});
      dispatchHelper.dispatchEpisodePage(store);
      dispatchHelper.dispatchEpisodeSelectList(store);
      dispatchHelper.dispatchSelectEpisodes(store, [episodes[0].guid, episodes[1].guid]);
      dispatchHelper.dispatchEpisodeDropday(store);

      store.pipe(select(selectDropdayChartMetrics)).subscribe((data) => {
        result = <IndexedChartModel[]>data;
      });
    });

    it('should get episodes with cumulative data sorted by publish date ascending', () => {
      expect(result.length).toEqual(episodes.length);
      expect(episodes[0].publishedAt.valueOf()).toBeGreaterThanOrEqual(episodes[1].publishedAt.valueOf());
      expect(result[0].label).toEqual(episodes[1].title);
      expect(result[0].data.length).toEqual(ep1Downloads.length);
      expect(result[0].data[0]).toEqual(ep1Downloads[0][1]);
      expect(result[0].data[1]).toEqual(ep1Downloads[0][1] + ep1Downloads[1][1]);
      expect(result[0].data[2]).toEqual(ep1Downloads[0][1] + ep1Downloads[1][1] + ep1Downloads[2][1]);
      expect(result[1].label).toEqual(episodes[0].title);
      expect(result[1].data.length).toEqual(ep0Downloads.length);
      expect(result[1].data[0]).toEqual(ep0Downloads[0][1]);
      expect(result[1].data[1]).toEqual(ep0Downloads[0][1] + ep0Downloads[1][1]);
      expect(result[1].data[2]).toEqual(ep0Downloads[0][1] + ep0Downloads[1][1] + ep0Downloads[2][1]);
    });

    it('should only include selected episodes', () => {
      expect(result.length).toEqual(episodes.length);
      dispatchHelper.dispatchSelectEpisodes(store, [episodes[0].guid]);
      expect(result.length).toEqual(1);
    });

    it('should number non-unique episode titles', () => {
      dispatchHelper.dispatchEpisodeSelectList(store, [episodes[0], {...episodes[1], title: episodes[0].title}]);
      dispatchHelper.dispatchSelectEpisodes(store, [episodes[0].guid, episodes[1].guid]);
      expect(result[0].label.indexOf('(1)')).toBeGreaterThan(-1);
    });
  });

});
