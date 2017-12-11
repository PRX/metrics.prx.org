import { CmsPodcastEpisodePageAction } from '../actions';
import { EpisodeReducer } from './episode.reducer';

describe('EpisodeReducer', () => {
  let newState;
  beforeEach(() => {
    newState = EpisodeReducer(undefined,
      new CmsPodcastEpisodePageAction({
        episodes: [{
          seriesId: 37800,
          id: 123,
          publishedAt: new Date(),
          title: 'A Pet Talk Episode',
          guid: 'abcdefg'
        }]
      }));
  });

  it('should update with new episode', () => {
    expect(newState.length).toEqual(1);
    expect(newState[0].seriesId).toEqual(37800);
  });

  it('should update existing podcast episodes keyed by seriesId and episode id', () => {
    newState = EpisodeReducer(newState, new CmsPodcastEpisodePageAction({
      episodes: [{
        seriesId: 37800,
        id: 123,
        publishedAt: new Date(),
        title: 'Actually a different Pet Talk Episode',
        guid: 'gfedcba'
      }]
    }));
    expect(newState.length).toEqual(1);
    expect(newState[0].title).toEqual('Actually a different Pet Talk Episode');
  });

  it ('should replace all episodes in existing podcast', () => {
    newState = EpisodeReducer(newState, new CmsPodcastEpisodePageAction({
      episodes: [
        {
          seriesId: 37800,
          id: 123,
          publishedAt: new Date(),
          title: 'Actually a different Pet Talk Episode',
          guid: 'gfedcba'
        },
        {
          seriesId: 37800,
          id: 1234,
          publishedAt: new Date(),
          title: 'A New Pet Talk Episode',
          guid: 'hijklmno'
        }
      ]
    }));
    expect(newState.filter(p => p.seriesId === 37800).length).toEqual(2);
  });
});
