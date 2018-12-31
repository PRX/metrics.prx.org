import { CastlePodcastMetricsSuccessAction } from '../actions/castle.action.creator';
import { RouterParams, INTERVAL_DAILY, MetricsType, METRICSTYPE_DOWNLOADS, getMetricsProperty } from './models';
import { PodcastMetricsReducer, PodcastMetricsState, selectAllPodcastMetrics } from './podcast-metrics.reducer';
import { podcast } from '../../../testing/downloads.fixtures';
import { ChartTogglePodcastAction } from '../actions';

describe('PodcastMetricsReducer', () => {
  let newState;
  const routerParams: RouterParams = {
    metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
    beginDate: new Date('2017-08-27T00:00:00Z'),
    endDate: new Date('2017-09-07T00:00:00Z'),
    interval: INTERVAL_DAILY
  };
  const metricsPropertyName = getMetricsProperty(routerParams.interval, routerParams.metricsType);
  beforeEach(() => {
    newState = PodcastMetricsReducer(undefined,
      new CastlePodcastMetricsSuccessAction({
        id: podcast.id,
        metricsPropertyName,
        metrics: []
      })
    );
  });

  it('should update with new podcast metrics', () => {
    expect(newState.length).toEqual(1);
    expect(newState[0].id).toEqual(podcast.id);
  });

  it('should update existing podcast metrics keyed by id', () => {
    newState = PodcastMetricsReducer(newState,
      new CastlePodcastMetricsSuccessAction({
        id: podcast.id,
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
    expect(newState.length).toEqual(1);
    expect(newState[0].id).toEqual(podcast.id);
    expect(newState[0].dailyReach.length).toEqual(12);
    expect(newState[0].dailyReach[0][1]).toEqual(52522);
  });

  it ('should add new podcast metrics', () => {
    newState = PodcastMetricsReducer(newState,
      new CastlePodcastMetricsSuccessAction({
        id: '71',
        metricsPropertyName,
        metrics: []
      })
    );
    expect(newState.length).toEqual(2);
  });

  fit('should toggle the charted state of a podcast', () => {
    // TODO: Go back to before hook method of setting initial state
    const initialState: PodcastMetricsState = {
      ids: ['71'],
      entities: {
        71: {
          id: '71',
          charted: true
        }
      }
    }

    // const oldChartedState = newState[0].charted
    const oldPodcastState = selectAllPodcastMetrics(initialState)[0];
    newState = PodcastMetricsReducer(initialState,
      new ChartTogglePodcastAction({
        id: oldPodcastState.id,
        charted: !oldPodcastState.charted
      })
    );
    expect(newState.entities[oldPodcastState.id].charted).toEqual(!oldPodcastState.charted);
  });
});
