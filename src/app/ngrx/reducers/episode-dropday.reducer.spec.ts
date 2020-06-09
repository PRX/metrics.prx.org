import * as ACTIONS from '../actions';
import * as fromEpisodeDropday from './episode-dropday.reducer';
import { episodes, ep0Downloads, ep1Downloads } from '@testing/downloads.fixtures';
import { INTERVAL_DAILY } from './models';

describe('EpisodeDownloadsReducer', () => {
  let newState: fromEpisodeDropday.State;
  beforeEach(() => {
    newState = fromEpisodeDropday.reducer(
      undefined,
      new ACTIONS.CastleEpisodeDropdaySuccessAction({
        podcastId: '70',
        interval: INTERVAL_DAILY,
        guid: episodes[0].guid,
        title: episodes[0].title,
        publishedAt: new Date(),
        downloads: [],
      })
    );
  });

  it('should update with new episode dropday metrics', () => {
    expect(fromEpisodeDropday.selectAllEpisodeDropday(newState).length).toEqual(1);
    expect(fromEpisodeDropday.selectAllEpisodeDropday(newState)[0].podcastId).toEqual('70');
    expect(fromEpisodeDropday.selectAllEpisodeDropday(newState)[0].guid).toEqual(episodes[0].guid);
  });

  it('should update existing episode dropday metrics', () => {
    newState = fromEpisodeDropday.reducer(
      newState,
      new ACTIONS.CastleEpisodeDropdaySuccessAction({
        podcastId: '70',
        interval: INTERVAL_DAILY,
        guid: episodes[0].guid,
        title: episodes[0].title,
        publishedAt: new Date(),
        downloads: ep0Downloads,
      })
    );
    expect(fromEpisodeDropday.selectAllEpisodeDropday(newState).length).toEqual(1);
    expect(fromEpisodeDropday.selectAllEpisodeDropday(newState)[0].guid).toEqual(episodes[0].guid);
    expect(fromEpisodeDropday.selectAllEpisodeDropday(newState)[0].downloads.length).toEqual(ep0Downloads.length);
    expect(fromEpisodeDropday.selectAllEpisodeDropday(newState)[0].downloads[0][1]).toEqual(ep0Downloads[0][1]);
  });

  it('should add new episode dropday metrics', () => {
    newState = fromEpisodeDropday.reducer(
      newState,
      new ACTIONS.CastleEpisodeDropdaySuccessAction({
        podcastId: '70',
        interval: INTERVAL_DAILY,
        guid: episodes[1].guid,
        title: episodes[1].title,
        publishedAt: new Date(),
        downloads: ep1Downloads,
      })
    );
    expect(fromEpisodeDropday.selectAllEpisodeDropday(newState).filter((p) => p.podcastId === '70').length).toEqual(2);
  });
});
