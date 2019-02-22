import { Rank } from './rank.model';
import { IntervalModel } from './interval.model';
import { GroupType, GROUPTYPE_GEOSUBDIV } from './group.type';
import * as dateFormat from '../../../shared/util/date/date.format';

export interface PodcastRanks {
  id: string;
  podcastId: string;
  group: GroupType;
  filter: string;
  interval: IntervalModel;
  beginDate: Date;
  endDate: Date;
  downloads: any[][];
  ranks: Rank[];
  loaded: boolean;
  loading: boolean;
  error?: any;
}

export function podcastRanksId(podcastId: string,
                                group: GroupType,
                                filter: string,
                                interval: IntervalModel,
                                beginDate: Date,
                                endDate: Date): string {
  let id = group === GROUPTYPE_GEOSUBDIV ?
    `${podcastId}-${group}-${filter}-${interval && interval.key}` : `${podcastId}-${group}-${interval && interval.key}`;
  id += `-${dateFormat.monthDateYear(beginDate, false)}-${dateFormat.monthDateYear(endDate, false)}`;
  return id;
}
