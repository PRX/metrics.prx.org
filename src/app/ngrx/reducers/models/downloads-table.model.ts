import { TimeseriesDatumModel } from 'ngx-prx-styleguide';

export interface DownloadsTableModel {
  id: string;
  title: string;
  publishedAt?: Date;
  color: string;
  totalForPeriod: number;
  allTimeDownloads?: number;
  charted: boolean;
}

export interface DownloadsTableIntervalModel {
  id: string;
  downloads: TimeseriesDatumModel[];
}
