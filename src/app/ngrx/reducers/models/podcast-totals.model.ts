import { Rank } from './rank.model';
import { GroupType, GROUPTYPE_GEOSUBDIV } from './group.type';
import * as dateFormat from '../../../shared/util/date/date.format';

export interface PodcastTotals {
  id: string;
  podcastId: string;
  group: GroupType;
  filter: string;
  beginDate: Date;
  endDate: Date;
  ranks: Rank[];
  loaded: boolean;
  loading: boolean;
  error?: any;
}

export function podcastTotalsId(podcastId: string, group: GroupType, filter: string, beginDate: Date, endDate: Date): string {
  let id = group === GROUPTYPE_GEOSUBDIV ? `${podcastId}-${group}-${filter}` : `${podcastId}-${group}`;
  id += `-${dateFormat.monthDateYear(beginDate, false)}-${dateFormat.monthDateYear(endDate, false)}`;
  return id;
}
