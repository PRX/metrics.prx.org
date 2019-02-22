import { GroupType } from './group.type';
export interface GroupCharted {
  id: string;
  group: GroupType;
  groupName: string;
  charted: boolean;
}
