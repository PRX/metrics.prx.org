import { CmsPodcastFeedAction } from '../actions';
import { PodcastReducer } from './podcast.reducer';

describe('PodcastReducer', () => {
  let newState;
  beforeEach(() => {
    newState = PodcastReducer(undefined,
      new CmsPodcastFeedAction({
        podcast: {
          doc: undefined,
          seriesId: 37800,
          title: 'Pet Talks Daily',
          feederUrl: 'https://feeder.prx.org/api/v1/podcasts/70',
          feederId: '70'
        }
      }));
  });

  it('should update with new podcast', () => {
    expect(newState.length).toEqual(1);
    expect(newState[0].seriesId).toEqual(37800);
  });

  it('should update existing podcasts keyed by seriesId', () => {
    newState = PodcastReducer(newState,
      new CmsPodcastFeedAction({
        podcast: {
          doc: undefined,
          seriesId: 37800,
          title: 'Something that is not Pet Talks'
        }
      }));
    expect(newState.length).toEqual(1);
    expect(newState[0].title).toEqual('Something that is not Pet Talks');
  });
});
