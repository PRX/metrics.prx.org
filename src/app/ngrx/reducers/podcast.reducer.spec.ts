import { cmsPodcastFeed, cmsEpisodeGuid } from '../actions/cms.action.creator';
import { PodcastReducer } from './podcast.reducer';

describe('PodcastReducer', () => {
  let newState;
  beforeEach(() => {
    newState = PodcastReducer(undefined,
      cmsPodcastFeed({
        doc: undefined,
        seriesId: 37800,
        title: 'Pet Talks Daily',
        feederUrl: 'https://feeder.prx.org/api/v1/podcasts/70',
        feederId: '70'
      }));
  });

  it('should update with new podcast', () => {
    expect(newState.length).toEqual(1);
    expect(newState[0].seriesId).toEqual(37800);
  });

  it('should update existing podcasts keyed by seriesId', () => {
    newState = PodcastReducer(newState,
      cmsPodcastFeed({
        doc: undefined,
        seriesId: 37800,
        title: 'Something that is not Pet Talks'
      }));
    expect(newState.length).toEqual(1);
    expect(newState[0].title).toEqual('Something that is not Pet Talks');
  });

  it ('should add episodes to existing podcast', () => {
    newState = PodcastReducer(newState,
      cmsEpisodeGuid(
        {
          doc: undefined,
          seriesId: 37800,
          title: 'Pet Talks Daily'
        },
        {
          doc: undefined,
          seriesId: 37800,
          id: 123,
          publishedAt: new Date(),
          title: 'A Pet Talk Episode'
        }));
    expect(newState.length).toEqual(1);
    expect(newState[0].episodeIds.length).toEqual(1);

    newState = PodcastReducer(newState,
      cmsEpisodeGuid(
        {
          doc: undefined,
          seriesId: 37800,
          title: 'Pet Talks Daily'
        },
        {
          doc: undefined,
          seriesId: 37800,
          id: 1234,
          publishedAt: new Date(),
          title: 'A Different Pet Talk Episode'
        }));
    expect(newState[0].episodeIds.length).toEqual(2);
  });

  it ('should create a podcast entry for episode if podcast not found', () => {
    newState = PodcastReducer(newState,
      cmsEpisodeGuid(
        {
          doc: undefined,
          seriesId: 37801,
          title: 'Totally Not Pet Talks Daily'
        },
        {
          doc: undefined,
          seriesId: 37801,
          id: 123,
          publishedAt: new Date(),
          title: 'Totally Not a Pet Talk Episode'
        }));
    expect(newState.length).toEqual(2);
    expect(newState.find(p => p.seriesId === 37801).episodeIds.length).toEqual(1);
  });
});
