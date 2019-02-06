import { CastleEpisodeDownloadsSuccessAction, CastleEpisodePageSuccessAction } from '../actions';
import * as fromEpisodeDownloads from './episode-downloads.reducer';
import { episodes, ep0Downloads, ep1Downloads } from '../../../testing/downloads.fixtures';
import { EPISODE_PAGE_SIZE } from './models';

describe('EpisodeDownloadsReducer', () => {
  let newState: fromEpisodeDownloads.State;
  const episode = episodes[0];
  beforeEach(() => {
    newState = fromEpisodeDownloads.reducer(undefined,
      new CastleEpisodeDownloadsSuccessAction({
        podcastId: episode.podcastId, page: episode.page, guid: episode.guid,
        downloads: []
      })
    );
  });

  it('should update with new episode metrics', () => {
    expect(fromEpisodeDownloads.selectAllEpisodeDownloads(newState).length).toEqual(1);
    expect(fromEpisodeDownloads.selectAllEpisodeDownloads(newState)[0].podcastId).toEqual(episode.podcastId);
    expect(fromEpisodeDownloads.selectAllEpisodeDownloads(newState)[0].guid).toEqual(episode.guid);
  });

  it('should update existing episode downloads', () => {
    newState = fromEpisodeDownloads.reducer(newState,
      new CastleEpisodeDownloadsSuccessAction({
        podcastId: episode.podcastId, page: episode.page,
        guid: 'abcdefg',
        downloads: ep0Downloads
      })
    );
    expect(fromEpisodeDownloads.selectAllEpisodeDownloads(newState).length).toEqual(1);
    expect(fromEpisodeDownloads.selectAllEpisodeDownloads(newState)[0].guid).toEqual('abcdefg');
    expect(fromEpisodeDownloads.selectAllEpisodeDownloads(newState)[0].downloads.length).toEqual(ep0Downloads.length);
    expect(fromEpisodeDownloads.selectAllEpisodeDownloads(newState)[0].downloads[0][1]).toEqual(ep0Downloads[0][1]);
  });

  it ('should add new episode metrics', () => {
    newState = fromEpisodeDownloads.reducer(newState,
      new CastleEpisodeDownloadsSuccessAction({
        podcastId: episodes[1].podcastId,
        page: 1,
        guid: episodes[1].guid,
        downloads: ep1Downloads
      })
    );
    expect(fromEpisodeDownloads.selectAllEpisodeDownloads(newState).filter(p => p.podcastId === '70').length).toEqual(2);
  });

  it('should set loaded to false on episode page load if entry not already on state', () => {
    newState = fromEpisodeDownloads.reducer(newState,
      new CastleEpisodePageSuccessAction({
        page: 2,
        per: EPISODE_PAGE_SIZE,
        episodes: episodes,
        total: episodes.length
      })
    );
    expect(fromEpisodeDownloads.selectAllEpisodeDownloads(newState).filter(episodeDownloads =>
      episodeDownloads.page === 2).every(entry => !entry.loaded)).toBeTruthy();
  });
});
