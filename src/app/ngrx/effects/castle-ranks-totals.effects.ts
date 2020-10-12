import { Injectable } from '@angular/core';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import * as ACTIONS from '../actions';
import { CastleService } from '@app/core';
import { GROUPTYPE_GEOSUBDIV } from '../';

@Injectable()
export class CastleRanksTotalsEffects {
  // basic - load > success/failure podcast ranks
  loadPodcastRanks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.CastlePodcastRanksLoad),
      mergeMap(action => {
        const { podcastId, interval, group, filter: groupFilter, beginDate, endDate } = action;
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

        return this.castle.follow('prx:podcast-ranks', { ...params }).pipe(
          map(metrics => {
            return ACTIONS.CastlePodcastRanksSuccess({
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
            of(ACTIONS.CastlePodcastRanksFailure({ podcastId, group, filter: groupFilter, interval, beginDate, endDate, error }))
          )
        );
      })
    )
  );

  // basic - load > success/failure podcast totals
  loadPodcastTotals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.CastlePodcastTotalsLoad),
      mergeMap(action => {
        const { podcastId, group, filter: groupFilter, beginDate, endDate } = action;
        const params = {
          id: podcastId,
          group,
          from: beginDate.toISOString(),
          to: endDate.toISOString()
        };
        if (group === GROUPTYPE_GEOSUBDIV && groupFilter) {
          params['filters'] = `geocountry:${groupFilter}`;
        }

        return this.castle.follow('prx:podcast-totals', { ...params }).pipe(
          map(metrics => {
            return ACTIONS.CastlePodcastTotalsSuccess({
              podcastId,
              group,
              filter: groupFilter,
              beginDate,
              endDate,
              ranks: metrics['ranks'].map(rank => {
                const { count, label, code } = rank;
                return { total: count, label, code: code && String(code) };
              })
            });
          }),
          catchError(error => of(ACTIONS.CastlePodcastTotalsFailure({ podcastId, group, filter: groupFilter, beginDate, endDate, error })))
        );
      })
    )
  );

  // basic - load > success/failure episode ranks
  loadEpisodeRanks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.CastleEpisodeRanksLoad),
      mergeMap(action => {
        const { guid, interval, group, filter: groupFilter, beginDate, endDate } = action;
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

        return this.castle.followList('prx:episode-ranks', { ...params }).pipe(
          map(metrics => {
            return ACTIONS.CastleEpisodeRanksSuccess({
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
          catchError(error =>
            of(ACTIONS.CastleEpisodeRanksFailure({ guid, group, filter: groupFilter, interval, beginDate, endDate, error }))
          )
        );
      })
    )
  );

  // basic - load > success/failure episode totals
  loadEpisodeTotals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIONS.CastleEpisodeTotalsLoad),
      mergeMap(action => {
        const { guid, group, filter: groupFilter, beginDate, endDate } = action;
        const params = {
          id: guid,
          group,
          from: beginDate.toISOString(),
          to: endDate.toISOString()
        };
        if (group === GROUPTYPE_GEOSUBDIV && groupFilter) {
          params['filters'] = `geocountry:${groupFilter}`;
        }

        return this.castle.followList('prx:episode-totals', { ...params }).pipe(
          map(metrics => {
            return ACTIONS.CastleEpisodeTotalsSuccess({
              guid,
              group,
              filter: groupFilter,
              beginDate,
              endDate,
              ranks: metrics[0]['ranks'].map(rank => {
                const { count, label, code } = rank;
                return { total: count, label, code: code && String(code) };
              })
            });
          }),
          catchError(error => of(ACTIONS.CastleEpisodeTotalsFailure({ guid, group, filter: groupFilter, beginDate, endDate, error })))
        );
      })
    )
  );

  constructor(private actions$: Actions, private castle: CastleService) {}
}
