import {
  CastlePodcastDownloadsSuccessAction,
  CastlePodcastDownloadsFailureAction,
  CastlePodcastDownloadsLoadAction
} from '../actions/castle.action.creator';
import { RouterParams, INTERVAL_DAILY, MetricsType, METRICSTYPE_DOWNLOADS, getMetricsProperty } from './models';
import {
  PodcastDownloadsReducer,
  selectAllPodcastDownloads,
  selectPodcastDownloadsIds,
  initialState as PodcastDownloadsInitialState,
  selectPodcastDownloadsEntities
} from './podcast-downloads.reducer';
import { podcast } from '../../../testing/downloads.fixtures';
import { ChartTogglePodcastAction } from '../actions';

describe('PodcastDownloadsReducer', () => {
  let initialState;
  const routerParams: RouterParams = {
    metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
    beginDate: new Date('2017-08-27T00:00:00Z'),
    endDate: new Date('2017-09-07T00:00:00Z'),
    interval: INTERVAL_DAILY
  };
  const metricsPropertyName = getMetricsProperty(routerParams.interval, routerParams.metricsType);

  beforeEach(() => {
    initialState = PodcastDownloadsReducer(PodcastDownloadsInitialState,
      new CastlePodcastDownloadsSuccessAction({
        id: podcast.id,
        metricsPropertyName,
        metrics: []
      })
    );
  });

  it('should set loading and charted status for new loading entities', () => {
    const id = '1337';
    const loadActionPayload = {
      id,
      metricsType: routerParams.metricsType,
      interval: routerParams.interval,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate
    };
    const newState = PodcastDownloadsReducer(initialState,
      new CastlePodcastDownloadsLoadAction(loadActionPayload));

    const allPodcastDownloads = selectAllPodcastDownloads(newState);
    const loadingEntity = selectPodcastDownloadsEntities(newState)[id];
    expect(allPodcastDownloads.length).toEqual(2);
    expect(loadingEntity.charted).toEqual(true);
    expect(loadingEntity.error).toBe(null);
    expect(loadingEntity.loading).toEqual(true);
    expect(loadingEntity.loaded).toEqual(false);
    expect(loadingEntity.id).toEqual(id);
  });

  it('should set loading status for existing loading entities', () => {
    const id = <string>selectPodcastDownloadsIds(initialState)[0];
    const loadActionPayload = {
      id,
      metricsType: routerParams.metricsType,
      interval: routerParams.interval,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate
    };
    const newState = PodcastDownloadsReducer(initialState,
      new CastlePodcastDownloadsLoadAction(loadActionPayload));

    const allPodcastDownloads = selectAllPodcastDownloads(newState);
    const loadingEntity = selectPodcastDownloadsEntities(newState)[id];
    expect(allPodcastDownloads.length).toEqual(1);
    expect(loadingEntity.error).toBe(null);
    expect(loadingEntity.loading).toEqual(true);
    expect(loadingEntity.loaded).toEqual(false);
    expect(loadingEntity.id).toEqual(id);
  });

  it('should appropriately handle failure', () => {
    const id = '404';
    const error = 'There was a problem';
    const newState = PodcastDownloadsReducer(initialState,
      new CastlePodcastDownloadsFailureAction({ id, error }));

    const allPodcastDownloads = selectAllPodcastDownloads(newState);
    const failedEntity = selectPodcastDownloadsEntities(newState)[id];
    expect(allPodcastDownloads.length).toEqual(2);
    expect(failedEntity.loading).toEqual(false);
    expect(failedEntity.loaded).toEqual(true);
    expect(failedEntity.error).toEqual(error);
    expect(failedEntity.id).toEqual(id);
  });

  it('should update with new podcast metrics', () => {
    const allPodcastDownloads = selectAllPodcastDownloads(initialState);
    expect(allPodcastDownloads.length).toEqual(1);
    expect(allPodcastDownloads[0].id).toEqual(podcast.id);
  });

  it('should update existing podcast metrics keyed by id', () => {
    const id = <string>selectPodcastDownloadsIds(initialState)[0];
    const newState = PodcastDownloadsReducer(initialState,
      new CastlePodcastDownloadsSuccessAction({
        id,
        metricsPropertyName,
        metrics: [
          ['2017-08-27T00:00:00Z', 52522],
          ['2017-08-28T00:00:00Z', 162900],
          ['2017-08-29T00:00:00Z', 46858],
          ['2017-08-30T00:00:00Z', 52522],
          ['2017-08-31T00:00:00Z', 162900],
          ['2017-09-01T00:00:00Z', 46858],
          ['2017-09-02T00:00:00Z', 52522],
          ['2017-09-03T00:00:00Z', 162900],
          ['2017-09-04T00:00:00Z', 46858],
          ['2017-09-05T00:00:00Z', 52522],
          ['2017-09-06T00:00:00Z', 162900],
          ['2017-09-07T00:00:00Z', 46858]
        ]
      })
    );
    const allPodcastDownloads = selectAllPodcastDownloads(newState);
    expect(allPodcastDownloads.length).toEqual(1);
    expect(allPodcastDownloads[0].loading).toEqual(false);
    expect(allPodcastDownloads[0].loaded).toEqual(true);
    expect(allPodcastDownloads[0].id).toEqual(id);
    expect(allPodcastDownloads[0][metricsPropertyName].length).toEqual(12);
    expect(allPodcastDownloads[0][metricsPropertyName][0][1]).toEqual(52522);
  });

  it ('should add new podcast metrics', () => {
    const newState = PodcastDownloadsReducer(initialState,
      new CastlePodcastDownloadsSuccessAction({
        id: '71',
        metricsPropertyName,
        metrics: []
      })
    );
    expect(selectAllPodcastDownloads(newState).length).toEqual(2);
  });

  it('should toggle the charted state of a podcast', () => {
    const oldPodcastState = selectAllPodcastDownloads(initialState)[0];
    const newState = PodcastDownloadsReducer(initialState,
      new ChartTogglePodcastAction({
        id: oldPodcastState.id,
        charted: !oldPodcastState.charted
      })
    );
    expect(newState.entities[oldPodcastState.id].charted).toEqual(!oldPodcastState.charted);
  });
});
