import { TimeseriesDatumModel } from 'ngx-prx-styleguide';

export interface DownloadsTableModel {
  id: string;
  title: string;
  publishedAt?: Date;
  color: string;
  downloads: TimeseriesDatumModel[];
  totalForPeriod: number;
  allTimeDownloads?: number;
  charted: boolean;
}
