import { Injectable } from '@angular/core';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import * as ACTIONS from '../actions';
import { CastleService } from '@app/core';
import { GROUPTYPE_GEOSUBDIV } from '../';

@Injectable()
export class CastleRanksTotalsEffects {

  // basic - load > success/failure podcast ranks
  @Effect()
  loadPodcastRanks$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_RANKS_LOAD),
    map((action: ACTIONS.CastlePodcastRanksLoadAction) => action.payload),
    mergeMap((payload: ACTIONS.CastlePodcastRanksLoadPayload) => {
      const { podcastId, interval, group, filter: groupFilter, beginDate, endDate } = payload;
      const params = {
        id: podcastId,
        group,
        interval: interval.value,
        from: beginDate.toISOString(),
        to: endDate.toISOString()
      };
      if (group === GROUPTYPE_GEOSUBDIV && groupFilter) {
        params['filters'] = `geocountry:${groupFilter}`;
      }

      return this.castle.follow('prx:podcast-ranks', {...params}).pipe(
        map(metrics => {
          return new ACTIONS.CastlePodcastRanksSuccessAction({
            podcastId,
            group,
            filter: groupFilter,
            interval,
            beginDate,
            endDate,
            downloads: metrics['downloads'],
            ranks: metrics['ranks'].map(r => {
              return { ...r, code: r.code && String(r.code) };
            })
          });
        }),
        catchError(error =>
          of(new ACTIONS.CastlePodcastRanksFailureAction({podcastId, group, filter: groupFilter, interval, beginDate, endDate, error})))
      );
    })
  );

  // basic - load > success/failure podcast totals
  @Effect()
  loadPodcastTotals$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_PODCAST_TOTALS_LOAD),
    map((action: ACTIONS.CastlePodcastTotalsLoadAction) => action.payload),
    mergeMap((payload: ACTIONS.CastlePodcastTotalsLoadPayload) => {
      const { podcastId, group, filter: groupFilter, beginDate, endDate } = payload;
      const params = {
        id: podcastId,
        group,
        from: beginDate.toISOString(),
        to: endDate.toISOString()
      };
      if (group === GROUPTYPE_GEOSUBDIV && groupFilter) {
        params['filters'] = `geocountry:${groupFilter}`;
      }

      return this.castle.follow('prx:podcast-totals', {...params}).pipe(
        map(metrics => {
          return new ACTIONS.CastlePodcastTotalsSuccessAction({
            podcastId,
            group,
            filter: groupFilter,
            beginDate,
            endDate,
            ranks: metrics['ranks'].map(rank => {
              const { count, label, code }  = rank;
              return { total: count, label, code: code && String(code) };
            })
          });
        }),
        catchError(error =>
          of(new ACTIONS.CastlePodcastTotalsFailureAction({podcastId, group, filter: groupFilter, beginDate, endDate, error})))
      );
    })
  );

  // basic - load > success/failure episode ranks
  @Effect()
  loadEpisodeRanks$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_RANKS_LOAD),
    map((action: ACTIONS.CastleEpisodeRanksLoadAction) => action.payload),
    mergeMap((payload: ACTIONS.CastleEpisodeRanksLoadPayload) => {
      const { guid, interval, group, filter: groupFilter, beginDate, endDate } = payload;
      const params = {
        guid,
        group,
        interval: interval.value,
        from: beginDate.toISOString(),
        to: endDate.toISOString()
      };
      if (group === GROUPTYPE_GEOSUBDIV && groupFilter) {
        params['filters'] = `geocountry:${groupFilter}`;
      }

      return this.castle.followList('prx:episode-ranks', {...params}).pipe(
        map(metrics => {
          return new ACTIONS.CastleEpisodeRanksSuccessAction({
            guid,
            group,
            filter: groupFilter,
            interval,
            beginDate,
            endDate,
            downloads: metrics[0]['downloads'],
            ranks: metrics[0]['ranks'].map(r => {
              return { ...r, code: r.code && String(r.code) };
            })
          });
        }),
        catchError(error => of(
          new ACTIONS.CastleEpisodeRanksFailureAction({guid, group, filter: groupFilter, interval, beginDate, endDate, error})))
      );
    })
  );

  // basic - load > success/failure episode totals
  @Effect()
  loadEpisodeTotals$: Observable<Action> = this.actions$.pipe(
    ofType(ACTIONS.ActionTypes.CASTLE_EPISODE_TOTALS_LOAD),
    map((action: ACTIONS.CastleEpisodeTotalsLoadAction) => action.payload),
    mergeMap((payload: ACTIONS.CastleEpisodeTotalsLoadPayload) => {
      const { guid, group, filter: groupFilter, beginDate, endDate } = payload;
      const params = {
        id: guid,
        group,
        from: beginDate.toISOString(),
        to: endDate.toISOString()
      };
      if (group === GROUPTYPE_GEOSUBDIV && groupFilter) {
        params['filters'] = `geocountry:${groupFilter}`;
      }

      return this.castle.followList('prx:episode-totals', {...params}).pipe(
        map(metrics => {
          return new ACTIONS.CastleEpisodeTotalsSuccessAction({
            guid,
            group,
            filter: groupFilter,
            beginDate,
            endDate,
            ranks: metrics[0]['ranks'].map(rank => {
              const { count, label, code }  = rank;
              return { total: count, label, code: code && String(code) };
            })
          });
        }),
        catchError(error => of(new ACTIONS.CastleEpisodeTotalsFailureAction({guid, group, filter: groupFilter, beginDate, endDate, error})))
      );
    })
  );

  constructor(private actions$: Actions,
              private castle: CastleService) {}
}
