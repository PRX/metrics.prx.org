import { TimeseriesDatumModel } from 'ngx-prx-styleguide';

export interface DownloadsTableModel {
  title: string;
  publishedAt?: Date;
  color: string;
  id?: number;
  downloads: TimeseriesDatumModel[];
  totalForPeriod: number;
  allTimeDownloads?: number;
  charted: boolean;
}
