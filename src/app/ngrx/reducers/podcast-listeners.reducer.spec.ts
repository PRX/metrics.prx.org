import { RouterParams, INTERVAL_LASTWEEK, MetricsType, METRICSTYPE_LISTENERS } from './models';
import {
  reducer,
  selectAllPodcastListeners,
  selectPodcastListenersIds,
  initialState as PodcastListenersInitialState,
  selectPodcastListenersEntities
} from './podcast-listeners.reducer';
import * as downloadActions from '../actions/castle-downloads.action.creator';
import { podcast } from '../../../testing/downloads.fixtures';

describe('PodcastListenersReducer', () => {
  let initialState;
  const routerParams: RouterParams = {
    metricsType: <MetricsType>METRICSTYPE_LISTENERS,
    beginDate: new Date('2017-08-27T00:00:00Z'),
    endDate: new Date('2017-09-07T00:00:00Z'),
    interval: INTERVAL_LASTWEEK
  };

  beforeEach(() => {
    initialState = reducer(
      PodcastListenersInitialState,
      downloadActions.CastlePodcastListenersSuccess({
        id: podcast.id,
        listeners: []
      })
    );
  });

  it('should set loading status for new loading entities', () => {
    const id = '1337';
    const loadActionPayload = {
      id,
      interval: routerParams.interval,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate
    };
    const newState = reducer(initialState, downloadActions.CastlePodcastListenersLoad(loadActionPayload));

    const allPodcastListeners = selectAllPodcastListeners(newState);
    const loadingEntity = selectPodcastListenersEntities(newState)[id];
    expect(allPodcastListeners.length).toEqual(2);
    expect(loadingEntity.error).toBe(null);
    expect(loadingEntity.loading).toEqual(true);
    expect(loadingEntity.loaded).toEqual(false);
    expect(loadingEntity.id).toEqual(id);
  });

  it('should set loading status for existing loading entities', () => {
    const id = <string>selectPodcastListenersIds(initialState)[0];
    const loadActionPayload = {
      id,
      interval: routerParams.interval,
      beginDate: routerParams.beginDate,
      endDate: routerParams.endDate
    };
    const newState = reducer(initialState, downloadActions.CastlePodcastListenersLoad(loadActionPayload));

    const allPodcastListeners = selectAllPodcastListeners(newState);
    const loadingEntity = selectPodcastListenersEntities(newState)[id];
    expect(allPodcastListeners.length).toEqual(1);
    expect(loadingEntity.error).toBe(null);
    expect(loadingEntity.loading).toEqual(true);
    expect(loadingEntity.loaded).toEqual(false);
    expect(loadingEntity.id).toEqual(id);
  });

  it('should appropriately handle failure', () => {
    const id = '404';
    const error = 'There was a problem';
    const newState = reducer(initialState, downloadActions.CastlePodcastListenersFailure({ id, error }));

    const allPodcastListeners = selectAllPodcastListeners(newState);
    const failedEntity = selectPodcastListenersEntities(newState)[id];
    expect(allPodcastListeners.length).toEqual(2);
    expect(failedEntity.loading).toEqual(false);
    expect(failedEntity.loaded).toEqual(true);
    expect(failedEntity.error).toEqual(error);
    expect(failedEntity.id).toEqual(id);
  });

  it('should update with new podcast listener metrics', () => {
    const allPodcastListeners = selectAllPodcastListeners(initialState);
    expect(allPodcastListeners.length).toEqual(1);
    expect(allPodcastListeners[0].id).toEqual(podcast.id);
  });

  it('should update existing podcast listener metrics keyed by id', () => {
    const id = <string>selectPodcastListenersIds(initialState)[0];
    const newState = reducer(
      initialState,
      downloadActions.CastlePodcastListenersSuccess({
        id,
        listeners: [
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
    const allPodcastListeners = selectAllPodcastListeners(newState);
    expect(allPodcastListeners.length).toEqual(1);
    expect(allPodcastListeners[0].loading).toEqual(false);
    expect(allPodcastListeners[0].loaded).toEqual(true);
    expect(allPodcastListeners[0].id).toEqual(id);
    expect(allPodcastListeners[0].listeners.length).toEqual(12);
    expect(allPodcastListeners[0].listeners[0][1]).toEqual(52522);
  });

  it('should add new podcast listener metrics', () => {
    const newState = reducer(
      initialState,
      downloadActions.CastlePodcastListenersSuccess({
        id: '71',
        listeners: []
      })
    );
    expect(selectAllPodcastListeners(newState).length).toEqual(2);
  });
});
