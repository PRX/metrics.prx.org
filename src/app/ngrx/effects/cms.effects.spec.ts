import { Actions } from '@ngrx/effects';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { cold, hot } from 'jasmine-marbles';
import { MockHalService, AuthModule, FancyFormModule } from 'ngx-prx-styleguide';
import { CmsService } from '../../core';
import { SharedModule } from '../../shared';
import { getActions, TestActions } from './test.actions';
import { PodcastModel, EpisodeModel } from '../';
import { downloadsRouting } from '../../downloads/downloads.routing';
import { DownloadsComponent } from '../../downloads/downloads.component';
import { DownloadsChartComponent } from '../../downloads/downloads-chart.component';
import { DownloadsTableComponent } from '../../downloads/downloads-table.component';
import { getColor } from '../../shared/util/chart.util';
import { reducers } from '../reducers';
import { CmsPodcastEpisodePageAction, CmsPodcastEpisodePageSuccessAction } from '../actions';
import { CmsEffects } from './cms.effects';

describe('CmsEffects', () => {
  let effects: CmsEffects;
  let actions$: TestActions;
  let cms: MockHalService;
  let expected: Observable<CmsPodcastEpisodePageSuccessAction>;

  const podcast: PodcastModel = {
    seriesId: 37800,
    feederId: '70',
    title: 'Pet Talks Daily'
  };
  const episodes: EpisodeModel[] = [
    {
      seriesId: 37800,
      id: 123,
      publishedAt: new Date('2018-01-01'),
      title: 'A Pet Talk Episode',
      feederUrl: 'https://feeder.prx.org/api/v1/episodes/abcdefg',
      guid: 'abcdefg',
      color: getColor(2, 0),
      page: 1
    },
    {
      seriesId: 37800,
      id: 124,
      publishedAt: new Date('2018-01-02'),
      title: 'A More Recent Pet Talk Episode',
      feederUrl: 'https://feeder.prx.org/api/v1/episodes/gfedcba',
      guid: 'gfedcba',
      color: getColor(2, 1),
      page: 1
    }
  ];

  beforeEach(async(() => {
    cms = new MockHalService();
    const series = cms.root.mock('prx:series', {id: 37800, title: 'Pet Talks Daily'});
    const stories = series.mockItems('prx:stories', [
      {id: 123, title: 'A Pet Talk Episode', publishedAt: new Date('2018-01-01')},
      {id: 124, title: 'A More Recent Pet Talk Episode', publishedAt: new Date('2018-01-02')}
    ]);
    stories[0].mockItems('prx:distributions',
        [{kind: 'episode', url: 'https://feeder.prx.org/api/v1/episodes/abcdefg'}]);
    stories[1].mockItems('prx:distributions',
      [{kind: 'episode', url: 'https://feeder.prx.org/api/v1/episodes/gfedcba'}]);
    episodes[0].doc = stories[0];
    episodes[1].doc = stories[1];

    TestBed.configureTestingModule({
      declarations: [
        DownloadsComponent,
        DownloadsChartComponent,
        DownloadsTableComponent
      ],
      imports: [
        RouterTestingModule,
        downloadsRouting,
        AuthModule,
        FancyFormModule,
        SharedModule,
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([CmsEffects])
      ],
      providers: [
        CmsEffects,
        {provide: CmsService, useValue: cms.root},
        { provide: Actions, useFactory: getActions }
      ]
    });

    effects = TestBed.get(CmsEffects);
    actions$ = TestBed.get(Actions);

    spyOn(effects, 'routeWithEpisodeCharted').and.callThrough();

    effects.routeParams = {
      beginDate: '2017-12-03T00:00:00.000Z',
      chartPodcast: 'true',
      endDate: '2017-12-14T23:59:59.999Z',
      episodes: '',
      interval: 'daily',
      page: '1',
      seriesId: '37800',
      standardRange: '2 weeks'
    };

    const action = new CmsPodcastEpisodePageAction({podcast, page: 1});
    effects.store.dispatch(action);
    actions$.stream = hot('-a', { a: action });
    const result = new CmsPodcastEpisodePageSuccessAction({episodes});
    expected = cold('-r', { r: result });
  }));

  it('should create load episodes page and dispatch CmsPodcastEpisodePageSuccessAction with page of episodes', () => {
    expect(effects.loadEpisodes$).toBeObservable(expected);
  });

  it('should route to path that includes up to the first five episodes in chart', () => {
    // (toBeObservable is what initiates the jasmine marbles streaming)
    expect(effects.loadEpisodes$).toBeObservable(expected);
    expect(effects.routeWithEpisodeCharted).toHaveBeenCalledWith([123, 124]);
  });
});
