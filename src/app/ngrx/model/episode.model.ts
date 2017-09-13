import { HalDoc } from 'ngx-prx-styleguide';

export interface EpisodeModel {
  doc: HalDoc;
  id: number;
  seriesId: number;
  title: string;
  publishedAt: Date;
  feederUrl?: string;
  guid?: string;
}
