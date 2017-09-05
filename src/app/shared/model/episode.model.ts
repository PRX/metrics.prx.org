import { HalDoc } from 'ngx-prx-styleguide';

export interface EpisodeModel {
  doc: HalDoc;
  id: number;
  guid: string;
  title: string;
  publishedAt: Date;
}
