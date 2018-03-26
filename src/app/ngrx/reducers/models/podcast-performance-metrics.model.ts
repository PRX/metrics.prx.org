export interface PodcastPerformanceMetricsModel {
  seriesId: number;
  feederId: string;
  total?: number;
  previous7days?: number;
  this7days?: number;
  yesterday?: number;
  today?: number;
  loaded?: boolean;
  loading?: boolean;
  error?: any;
}
