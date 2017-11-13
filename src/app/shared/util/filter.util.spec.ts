import * as filterUtil from './filter.util';

describe('filter.util', () => {
  it('should check if podcast changed', () => {
    expect(filterUtil.isPodcastChanged({podcastSeriesId: 123}, {})).toBeTruthy();
    expect(filterUtil.isPodcastChanged({podcastSeriesId: 123}, undefined)).toBeTruthy();
    expect(filterUtil.isPodcastChanged({podcastSeriesId: 123}, {podcastSeriesId: 1234})).toBeTruthy();
    expect(filterUtil.isPodcastChanged(undefined, undefined)).toBeFalsy();
    expect(filterUtil.isPodcastChanged(undefined, {podcastSeriesId: 1234})).toBeFalsy();
    expect(filterUtil.isPodcastChanged({podcastSeriesId: 123}, {podcastSeriesId: 123})).toBeFalsy();
  });

  it ('should check if episodes changed', () => {
    expect(filterUtil.isEpisodesChanged({episodeIds: [123, 1234]}, {})).toBeTruthy();
    expect(filterUtil.isEpisodesChanged({episodeIds: [123, 1234]}, undefined)).toBeTruthy();
    expect(filterUtil.isEpisodesChanged({episodeIds: [123, 1234]}, {episodeIds: [123]})).toBeTruthy();
    expect(filterUtil.isEpisodesChanged(undefined, undefined)).toBeFalsy();
    expect(filterUtil.isEpisodesChanged(undefined, {episodeIds: [123]})).toBeFalsy();
    expect(filterUtil.isEpisodesChanged({episodeIds: [123, 1234]}, {episodeIds: [123, 1234]})).toBeFalsy();
  });

  it('should check if interval changed', () => {

  });

  it('should check if begin date changed', () => {

  });

  it('should check if end date changed', () => {

  })
});
