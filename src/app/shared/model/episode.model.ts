import { HalDoc } from 'ngx-prx-styleguide';

export interface EpisodeModel {
  doc: HalDoc;
  id: number;
  title: string;
  publishedAt: Date;
  feederUrl?: string;
}
