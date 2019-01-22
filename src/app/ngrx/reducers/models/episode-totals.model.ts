import { Rank } from './rank.model';
import { GroupType, GROUPTYPE_GEOSUBDIV } from './group.type';
import * as dateFormat from '../../../shared/util/date/date.format';

export interface EpisodeTotals {
  key: string;
  guid: string;
  group: GroupType;
  filter: string;
  beginDate: Date;
  endDate: Date;
  ranks: Rank[];
  loaded: boolean;
  loading: boolean;
  error: any;
}

export function episodeTotalsKey(guid: string, group: GroupType, filter: string, beginDate: Date, endDate: Date): string {
  let key = group === GROUPTYPE_GEOSUBDIV ? `${guid}-${group}-${filter}` : `${guid}-${group}`;
  key += `-${dateFormat.monthDateYear(beginDate, false)}-${dateFormat.monthDateYear(endDate, false)}`;
  return key;
}
