import { CastleEpisodeMetricsSuccessAction, CastleEpisodePageSuccessAction } from '../actions';
import { INTERVAL_DAILY, MetricsType, METRICSTYPE_DOWNLOADS, RouterParams, getMetricsProperty } from '../';
import { EpisodeMetricsReducer } from './episode-metrics.reducer';
import { episodes, ep0Downloads, ep1Downloads } from '../../../testing/downloads.fixtures';

describe('EpisodeMetricsReducer', () => {
  let newState;
  const episode = episodes[0];
  const routerParams: RouterParams = {
    metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
    beginDate: new Date('2017-08-27T00:00:00Z'),
    endDate: new Date('2017-09-07T00:00:00Z'),
    interval: INTERVAL_DAILY
  };
  const metricsPropertyName = getMetricsProperty(routerParams.interval, routerParams.metricsType);
  beforeEach(() => {
    newState = EpisodeMetricsReducer(undefined,
      new CastleEpisodeMetricsSuccessAction({
        podcastId: episode.podcastId, page: episode.page, guid: episode.guid,
        metricsPropertyName,
        metrics: []
      })
    );
  });

  it('should update with new episode metrics', () => {
    expect(newState.length).toEqual(1);
    expect(newState[0].podcastId).toEqual(episode.podcastId);
    expect(newState[0].guid).toEqual('abcdefg');
  });

  it('should update existing episode metrics keyed by podcastId and episode guid', () => {
    newState = EpisodeMetricsReducer(newState,
      new CastleEpisodeMetricsSuccessAction({
        podcastId: episode.podcastId, page: episode.page,
        guid: 'abcdefg',
        metricsPropertyName,
        metrics: ep0Downloads
      })
    );
    expect(newState.length).toEqual(1);
    expect(newState[0].guid).toEqual('abcdefg');
    expect(newState[0].dailyReach.length).toEqual(ep0Downloads.length);
    expect(newState[0].dailyReach[0][1]).toEqual(ep0Downloads[0][1]);
  });

  it ('should add new episode metrics', () => {
    newState = EpisodeMetricsReducer(newState,
      new CastleEpisodeMetricsSuccessAction({
        podcastId: episodes[1].podcastId,
        page: 1,
        guid: episodes[1].guid,
        metricsPropertyName,
        metrics: ep1Downloads
      })
    );
    expect(newState.filter(p => p.podcastId === '70').length).toEqual(2);
  });

  it('should set loaded to false on episode page load if entry not already on state', () => {
    newState = EpisodeMetricsReducer(newState,
      new CastleEpisodePageSuccessAction({
        page: 2,
        episodes: episodes,
        total: episodes.length
      })
    );
    expect(newState.filter(episodeMetrics => episodeMetrics.page === 2).every(entry => !entry.loaded)).toBeTruthy();
  });
});
