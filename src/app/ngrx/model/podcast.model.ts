import { HalDoc } from 'ngx-prx-styleguide';

export interface PodcastModel {
  doc: HalDoc;
  seriesId: number;
  title: string;
  feederUrl?: string;
  feederId?: string;
}
