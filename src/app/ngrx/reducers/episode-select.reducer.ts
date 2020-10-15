import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Episode } from './models/episode.model';
import * as catalogActions from '../actions/castle-catalog.action.creator';
import * as chartActions from '../actions/chart-toggle.action.creator';
import * as episodeSelectActions from '../actions/episode-select.action.creator';
import * as routeActions from '../actions/router.action.creator';
import { METRICSTYPE_DOWNLOADS, METRICSTYPE_DROPDAY, METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_TRAFFICSOURCES } from './models';

export interface State extends EntityState<Episode> {
  downloadsSelected?: { [podcastId: string]: string[] };
  dropdaySelected?: { [podcastId: string]: string[] };
  aggregateSelected?: { [podcastId: string]: string[] };
  total: number;
  page: number;
  search?: string;
  searchTotal?: number;
  loading: boolean;
  error?: any;
}

export const adapter: EntityAdapter<Episode> = createEntityAdapter<Episode>({
  selectId: (e: Episode) => e.guid
});

export const initialState: State = adapter.getInitialState({
  downloadsSelected: {},
  dropdaySelected: {},
  aggregateSelected: {},
  total: null,
  page: null,
  loading: false
});

const _reducer = createReducer(
  initialState,
  on(catalogActions.CastleEpisodeSelectPageLoad, (state, action) => {
    const { page, search } = action;
    // if the search term has changed, clear episodes
    if (search !== state.search) {
      return {
        ...adapter.removeAll(state),
        page,
        search,
        error: null,
        loading: true
      };
    } else {
      return {
        ...state,
        page,
        search,
        error: null,
        loading: true
      };
    }
  }),
  on(catalogActions.CastleEpisodeSelectPageSuccess, (state, action) => {
    const { page, total, search, episodes } = action;
    return {
      ...adapter.upsertMany(episodes, state),
      // this here assumes that a CASTLE_EPISODE_SELECT_PAGE_SUCCESS will occur without search on application load
      // so that we can retain the unfiltered total amount of episodes
      ...(!search && { total }), // updates total property if search is not defined
      searchTotal: total, // search total is the total amount of filtered or unfiltered episodes, whereas total is only unfiltered
      page,
      loading: false
    };
  }),
  on(catalogActions.CastleEpisodeSelectPageFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      loading: false
    };
  }),
  on(episodeSelectActions.EpisodeSelectEpisodes, (state, action) => {
    const { podcastId, metricsType, episodeGuids } = action;
    switch (metricsType) {
      case METRICSTYPE_DOWNLOADS:
        return {
          ...state,
          downloadsSelected: {
            ...state.downloadsSelected,
            [podcastId]: episodeGuids && episodeGuids.length ? episodeGuids : null
          }
        };
      case METRICSTYPE_DROPDAY:
        return {
          ...state,
          dropdaySelected: {
            ...state.dropdaySelected,
            [podcastId]: episodeGuids && episodeGuids.length ? episodeGuids : null
          }
        };
      case METRICSTYPE_DEMOGRAPHICS:
      case METRICSTYPE_TRAFFICSOURCES:
      default:
        return {
          ...state,
          aggregateSelected: {
            ...state.aggregateSelected,
            [podcastId]: episodeGuids && episodeGuids.length ? episodeGuids : null
          }
        };
    }
  }),
  on(routeActions.RoutePodcast, (state, action) => {
    const { podcastId } = action;
    return {
      ...state,
      total: null,
      page: null,
      downloadsSelected: {
        ...state.downloadsSelected,
        [podcastId]: null
      },
      dropdaySelected: {
        ...state.dropdaySelected,
        [podcastId]: null
      },
      aggregateSelected: {
        ...state.aggregateSelected,
        [podcastId]: null
      },
      search: null
    };
  }),
  // HONESTLY, these two CHART_ actions here and applying this to paged downloads feels like a bad idea
  // Paged downloads was never meant to be combined with selected episodes
  // Selected episodes were to apply to the drop date chart
  // So these only affect selected episodes if there are already selected episodes for this podcast
  on(chartActions.ChartToggleEpisode, (state, action) => {
    const { podcastId, guid, charted } = action;
    if (state.downloadsSelected[podcastId]) {
      let selected = state.downloadsSelected[podcastId];
      if (charted && state.downloadsSelected[podcastId].indexOf(guid) === -1) {
        selected = [...state.downloadsSelected[podcastId], guid];
      } else if (!charted && state.downloadsSelected[podcastId].indexOf(guid) > -1) {
        selected = state.downloadsSelected[podcastId].filter(g => g !== guid);
      }
      return {
        ...state,
        downloadsSelected: {
          ...state.downloadsSelected,
          [podcastId]: selected
        }
      };
    } else {
      return state;
    }
  }),
  on(chartActions.ChartSingleEpisode, (state, action) => {
    // only selecting this episode if selected episodes is already set, BUT only selecting SINGLE_EPISODE
    const { podcastId, guid } = action;
    if (state.downloadsSelected[podcastId] && state.downloadsSelected[podcastId].length) {
      return {
        ...state,
        downloadsSelected: {
          ...state.downloadsSelected,
          [podcastId]: [guid]
        }
      };
    } else {
      return state;
    }
  })
);

export function reducer(state, action) {
  return _reducer(state, action);
}

export const {
  selectIds: selectEpisodeGuids,
  selectEntities: selectEpisodeEntities,
  selectAll: selectAllEpisodes
} = adapter.getSelectors();

export const getTotal = (state: State) => state.total;
export const getPage = (state: State) => state.page;
export const getSearch = (state: State) => state.search;
export const getSearchTotal = (state: State) => state.searchTotal;
export const getError = (state: State) => state.error;
export const getLoading = (state: State) => state.loading;
