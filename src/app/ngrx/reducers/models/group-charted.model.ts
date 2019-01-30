import { GroupType } from './group.type';
export interface GroupCharted {
  key: string;
  group: GroupType;
  groupName: string;
  charted: boolean;
}
