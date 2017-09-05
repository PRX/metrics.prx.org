import { HalDoc } from 'ngx-prx-styleguide';

export interface SeriesModel {
  doc: HalDoc;
  id: number;
  title: string;
  feederUrl?: string;
}
