import { CmsRecentEpisodeSuccessAction } from '../actions';
import { RecentEpisodeReducer } from './recent-episode.reducer';

describe('RecentEpisodeReducer', () => {
  let newState;
  beforeEach(() => {
    newState = RecentEpisodeReducer(undefined,
      new CmsRecentEpisodeSuccessAction({
        episode: {seriesId: 37800, id: 123, publishedAt: new Date(), title: 'foo'}
      }));
  });

  it('should update with new episode', () => {
    expect(Object.keys(newState.entities).length).toEqual(1);
    expect(newState.entities[37800].id).toEqual(123);
  });

  it('should update existing episodes keyed by seriesId', () => {
    newState = RecentEpisodeReducer(newState, new CmsRecentEpisodeSuccessAction({
      episode: {seriesId: 37800, id: 123, publishedAt: new Date(), title: 'bar'}
    }));
    expect(Object.keys(newState.entities).length).toEqual(1);
    expect(newState.entities[37800].title).toEqual('bar');
  });
});
