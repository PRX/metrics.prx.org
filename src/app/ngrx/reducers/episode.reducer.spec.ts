import { CmsPodcastEpisodePageSuccessAction } from '../actions';
import { EpisodeReducer } from './episode.reducer';

describe('EpisodeReducer', () => {
  let newState;
  beforeEach(() => {
    newState = EpisodeReducer(undefined,
      new CmsPodcastEpisodePageSuccessAction({
        episodes: [{
          seriesId: 37800,
          id: 123,
          publishedAt: new Date(),
          title: 'A Pet Talk Episode',
          guid: 'abcdefg',
          page: 1
        }]
      }));
  });

  it('should update with new episode', () => {
    expect(Object.keys(newState.entities).length).toEqual(1);
    expect(newState.entities[123].seriesId).toEqual(37800);
  });

  it('should update existing podcast episodes keyed by seriesId and episode id', () => {
    newState = EpisodeReducer(newState, new CmsPodcastEpisodePageSuccessAction({
      episodes: [{
        seriesId: 37800,
        id: 123,
        publishedAt: new Date(),
        title: 'Actually a different Pet Talk Episode',
        guid: 'gfedcba',
        page: 1
      }]
    }));
    expect(Object.keys(newState.entities).length).toEqual(1);
    expect(newState.entities[123].title).toEqual('Actually a different Pet Talk Episode');
  });
});
