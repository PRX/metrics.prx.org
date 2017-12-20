import { CmsPodcastsSuccessAction } from '../actions';
import { PodcastReducer, initialState, getPodcastEntities } from './podcast.reducer';

describe('PodcastReducer', () => {
  let newState;
  const podcast = {
      seriesId: 37800,
      title: 'Pet Talks Daily',
      feederUrl: 'https://feeder.prx.org/api/v1/podcasts/70',
      feederId: '70'
    };
  beforeEach(() => {
    newState = PodcastReducer(initialState, new CmsPodcastsSuccessAction({podcasts: [podcast]}));
  });

  it('should update with new podcasts', () => {
    expect(getPodcastEntities(newState)[37800]).toEqual(podcast);
  });

  it('should update existing podcasts keyed by seriesId', () => {
    const updatedPodcast = {
      seriesId: 37800,
      title: 'Something that is not Pet Talks'
    };
    newState = PodcastReducer(newState,
      new CmsPodcastsSuccessAction({
        podcasts: [updatedPodcast]
      }));
    expect(getPodcastEntities(newState)[37800].title).toEqual('Something that is not Pet Talks');
  });
});
