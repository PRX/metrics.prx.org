import { RouterParams, Episode, Podcast, ChartType, MetricsType,
  CHARTTYPE_STACKED, INTERVAL_DAILY, METRICSTYPE_DOWNLOADS } from '../app/ngrx';
import * as dateUtil from '../app/shared/util/date';

export const podcast: Podcast = {
  id: '70',
  title: 'Pet Talks Daily'
};

const publishedAt0 = new Date('2017-08-27T00:00:00Z');
const publishedAt1 = new Date('2017-08-20T00:00:00Z');
export const episodes: Episode[] = [
  {
    podcastId: podcast.id,
    guid: 'abcdefg',
    publishedAt: publishedAt0,
    title: 'A Pet Talk Episode',
    page: 1
  },
  {
    podcastId: podcast.id,
    guid: 'gfedcba',
    publishedAt: publishedAt1,
    title: 'Another Pet Talk Episode',
    page: 1
  }
];
export const routerParams: RouterParams = {
  podcastId: podcast.id,
  episodePage: 1,
  beginDate: dateUtil.beginningOfLast28DaysUTC().toDate(),
  endDate: dateUtil.endOfTodayUTC().toDate(),
  standardRange: dateUtil.LAST_28_DAYS,
  interval: INTERVAL_DAILY,
  chartType: <ChartType>CHARTTYPE_STACKED,
  metricsType: <MetricsType>METRICSTYPE_DOWNLOADS
};

export const podDownloads = [
  ['2017-08-27T00:00:00Z', 52522],
  ['2017-08-28T00:00:00Z', 162900],
  ['2017-08-29T00:00:00Z', 46858],
  ['2017-08-30T00:00:00Z', 52522],
  ['2017-08-31T00:00:00Z', 162900],
  ['2017-09-01T00:00:00Z', 46858],
  ['2017-09-02T00:00:00Z', 52522],
  ['2017-09-03T00:00:00Z', 162900],
  ['2017-09-04T00:00:00Z', 46858],
  ['2017-09-05T00:00:00Z', 52522],
  ['2017-09-06T00:00:00Z', 162900],
  ['2017-09-07T00:00:00Z', 46858]
];
export const podHourlyDownloads = [
  ['2017-09-07T00:00:00Z', 52522],
  ['2017-09-07T01:00:00Z', 162900],
  ['2017-09-07T02:00:00Z', 46858],
  ['2017-09-07T03:00:00Z', 52522],
  ['2017-09-07T04:00:00Z', 162900],
  ['2017-09-07T05:00:00Z', 46858],
  ['2017-09-07T06:00:00Z', 52522],
  ['2017-09-07T07:00:00Z', 162900],
  ['2017-09-07T08:00:00Z', 46858],
  ['2017-09-07T09:00:00Z', 52522],
  ['2017-09-07T10:00:00Z', 162900],
  ['2017-09-07T11:00:00Z', 46858],
  ['2017-09-07T12:00:00Z', 52522],
  ['2017-09-07T13:00:00Z', 162900],
  ['2017-09-07T14:00:00Z', 46858],
  ['2017-09-07T15:00:00Z', 52522],
  ['2017-09-07T16:00:00Z', 162900],
  ['2017-09-07T17:00:00Z', 46858],
  ['2017-09-07T18:00:00Z', 52522],
  ['2017-09-07T19:00:00Z', 162900],
  ['2017-09-07T20:00:00Z', 46858],
  ['2017-09-07T21:00:00Z', 52522],
  ['2017-09-07T22:00:00Z', 162900],
  ['2017-09-07T23:00:00Z', 46858]
];
export const ep0Downloads = [
  ['2017-08-27T00:00:00Z', 22],
  ['2017-08-28T00:00:00Z', 90],
  ['2017-08-29T00:00:00Z', 58],
  ['2017-08-30T00:00:00Z', 22],
  ['2017-08-31T00:00:00Z', 90],
  ['2017-09-01T00:00:00Z', 58],
  ['2017-09-02T00:00:00Z', 22],
  ['2017-09-03T00:00:00Z', 90],
  ['2017-09-04T00:00:00Z', 58],
  ['2017-09-05T00:00:00Z', 22],
  ['2017-09-06T00:00:00Z', 90],
  ['2017-09-07T00:00:00Z', 58]
];
export const ep1Downloads = [
  ['2017-08-27T00:00:00Z', 522],
  ['2017-08-28T00:00:00Z', 900],
  ['2017-08-29T00:00:00Z', 858],
  ['2017-08-30T00:00:00Z', 522],
  ['2017-08-31T00:00:00Z', 900],
  ['2017-09-01T00:00:00Z', 858],
  ['2017-09-02T00:00:00Z', 522],
  ['2017-09-03T00:00:00Z', 900],
  ['2017-09-04T00:00:00Z', 858],
  ['2017-09-05T00:00:00Z', 522],
  ['2017-09-06T00:00:00Z', 900],
  ['2017-09-07T00:00:00Z', 858]
];
export const podPerformance = {total: 1049120, previous7days: 5, this7days: 5, yesterday: 1, today: 1};
export const podPerformanceOff = {total: 1049119, previous7days: 5, this7days: 5, yesterday: 1, today: 1};
export const ep0Performance = {total: 680, previous7days: 0, this7days: 5, yesterday: 1, today: 1};
export const ep0PerformanceOff = {total: 679, previous7days: 0, this7days: 5, yesterday: 1, today: 1};
export const ep1Performance = {total: 9120, previous7days: 0, this7days: 5, yesterday: 1, today: 1};
export const ep1PerformanceOff = {total: 9119, previous7days: 0, this7days: 5, yesterday: 1, today: 1};

export const podcastAgentNameRanks = [
  {total: 2616678, label: 'Podcasts', code: 25},
  {total: 441618, label: 'Overcast', code: 14},
  {total: 420328, label: 'Unknown', code: 0},
  {total: 244226, label: 'Pocket Casts', code: 16},
  {total: 242802, label: 'iTunes', code: 12},
  {total: 226357, label: 'Stitcher', code: 23},
  {total: 176300, label: 'PodcastAddict', code: 18},
  {total: 143150, label: 'Chrome', code: 29},
  {total: 99392, label: 'CastBox', code: 8},
  {total: 38382, label: 'PodcastRepublic', code: 58},
  {total: 337650, label: 'Other', code: null}
];

export const podcastAgentNameDownloads = [
  ['2018-07-26T00:00:00Z', [96817, 11192, 14785, 6070, 10066, 10014, 6637, 8411, 3494, 1301, 12052]],
  ['2018-07-27T00:00:00Z', [75078, 7559, 11101, 4188, 7829, 6701, 5680, 5345, 2672, 1123, 8796]],
  ['2018-07-28T00:00:00Z', [57704, 6546, 9096, 2953, 5842, 4522, 3432, 3637, 1911, 685, 7018]],
  ['2018-07-29T00:00:00Z', [60974, 5782, 8384, 4021, 5595, 4258, 3965, 3519, 2107, 732, 6855]],
  ['2018-07-30T00:00:00Z', [65590, 8249, 11473, 4085, 6599, 4610, 4612, 4645, 2911, 662, 8029]],
  ['2018-07-31T00:00:00Z', [60281, 7945, 10473, 3309, 6076, 4261, 4194, 12465, 2923, 592, 8553]],
  ['2018-08-01T00:00:00Z', [231374, 62418, 38825, 35685, 16300, 22153, 17050, 8748, 7728, 4125, 34143]],
  ['2018-08-02T00:00:00Z', [100725, 11334, 15189, 6047, 9757, 9944, 6885, 6061, 3397, 1418, 11744]],
  ['2018-08-03T00:00:00Z', [73188, 8567, 11060, 4655, 7260, 6605, 4759, 4743, 2784, 979, 8859]],
  ['2018-08-04T00:00:00Z', [61293, 7117, 8986, 3771, 6069, 4583, 3813, 3349, 2240, 772, 7854]],
  ['2018-08-05T00:00:00Z', [62580, 6611, 9018, 3060, 6219, 4100, 3705, 3697, 2056, 828, 7384]],
  ['2018-08-06T00:00:00Z', [63391, 8246, 10196, 4278, 6915, 4383, 4544, 4847, 2581, 697, 7651]],
  ['2018-08-07T00:00:00Z', [60971, 7853, 11814, 3701, 6356, 4031, 3958, 5106, 2641, 858, 7773]],
  ['2018-08-08T00:00:00Z', [235351, 64185, 36344, 36194, 16780, 23595, 16893, 6594, 8298, 4832, 34616]],
  ['2018-08-09T00:00:00Z', [99467, 12461, 16057, 7047, 9795, 9910, 6372, 5254, 4105, 1355, 11518]],
  ['2018-08-10T00:00:00Z', [71716, 7843, 12583, 4295, 6582, 6272, 4573, 4273, 3054, 1010, 8444]],
  ['2018-08-11T00:00:00Z', [59075, 7473, 8748, 3530, 7524, 4687, 3242, 3087, 1972, 657, 6864]],
  ['2018-08-12T00:00:00Z', [58071, 5656, 10630, 3966, 6197, 4209, 4293, 3216, 2449, 586, 7116]],
  ['2018-08-13T00:00:00Z', [68270, 7053, 11261, 3945, 8517, 5013, 3613, 4239, 2766, 857, 7636]],
  ['2018-08-14T00:00:00Z', [111468, 43708, 16724, 23817, 10440, 7818, 6731, 4541, 3913, 1784, 18272]],
  ['2018-08-15T00:00:00Z', [196279, 27758, 32649, 16815, 15191, 19431, 14516, 6049, 7086, 3176, 24998]],
  ['2018-08-16T00:00:00Z', [94874, 9466, 15693, 5026, 8884, 9052, 6457, 4712, 3592, 1179, 9971]],
  ['2018-08-17T00:00:00Z', [73278, 6901, 11957, 3965, 6334, 6255, 5092, 4170, 3120, 1003, 8000]],
  ['2018-08-18T00:00:00Z', [57575, 5747, 9242, 3156, 6772, 4561, 3021, 3284, 2326, 930, 6739]],
  ['2018-08-19T00:00:00Z', [57676, 5416, 8904, 3086, 5915, 4136, 3279, 3215, 2418, 487, 6894]],
  ['2018-08-20T00:00:00Z', [63936, 6777, 10882, 4133, 8821, 4734, 4192, 4808, 3342, 883, 7367]],
  ['2018-08-21T00:00:00Z', [70467, 28567, 10505, 8826, 6684, 4300, 4541, 4880, 3335, 780, 10158]],
  ['2018-08-22T00:00:00Z', [229209, 43188, 37749, 30602, 17483, 22219, 16251, 6255, 8171, 4091, 32346]]
];

export const podcastGeoCountryRanks = [
  {total: 549016, label: 'United States', code: 'US'},
  {total: 71474, label: 'United Kingdom', code: 'GB'},
  {total: 56746, label: 'Canada', code: 'CA'},
  {total: 35582, label: 'Australia', code: 'AU'},
  {total: 11505, label: 'Germany', code: 'DE'},
  {total: 8335, label: 'Ireland', code: 'IE'},
  {total: 7271, label: 'New Zealand', code: 'NZ'},
  {total: 6153, label: 'Netherlands', code: 'NL'},
  {total: 6099, label: 'Sweden', code: 'SE'},
  {total: 4938, label: 'France', code: 'FR'},
  {total: 66606, label: 'Other', code: null}
];

export const podcastGeoCountryDownloads = [
  ['2018-08-02T00:00:00Z', [46386, 5431, 4396, 2744, 896, 490, 404, 382, 333, 320, 4756]],
  ['2018-08-03T00:00:00Z', [26992, 3102, 2872, 1298, 437, 296, 196, 223, 293, 197, 2638]],
  ['2018-08-04T00:00:00Z', [17280, 2167, 1772, 1424, 393, 188, 312, 241, 164, 128, 1939]],
  ['2018-08-05T00:00:00Z', [18031, 2270, 1551, 1320, 307, 162, 354, 296, 127, 93, 2055]],
  ['2018-08-06T00:00:00Z', [20743, 2315, 1509, 1210, 329, 207, 346, 192, 319, 126, 2417]],
  ['2018-08-07T00:00:00Z', [19130, 2691, 1972, 1338, 319, 299, 178, 134, 231, 153, 2477]],
  ['2018-08-08T00:00:00Z', [17824, 2571, 1832, 1126, 304, 189, 205, 273, 221, 135, 1906]],
  ['2018-08-09T00:00:00Z', [16628, 2168, 2029, 1234, 563, 250, 244, 144, 228, 114, 1645]],
  ['2018-08-10T00:00:00Z', [14842, 1650, 1718, 861, 389, 177, 164, 128, 123, 132, 2013]],
  ['2018-08-11T00:00:00Z', [11635, 1570, 1054, 812, 322, 222, 209, 179, 210, 59, 1366]],
  ['2018-08-12T00:00:00Z', [11395, 1562, 1314, 956, 197, 244, 194, 92, 86, 59, 1806]],
  ['2018-08-13T00:00:00Z', [14299, 1865, 1699, 907, 358, 190, 247, 162, 267, 68, 1943]],
  ['2018-08-14T00:00:00Z', [14273, 1833, 1553, 951, 389, 327, 236, 151, 139, 109, 1889]],
  ['2018-08-15T00:00:00Z', [53207, 7367, 5264, 3467, 1245, 736, 722, 544, 605, 706, 5744]],
  ['2018-08-16T00:00:00Z', [41652, 5988, 4498, 2514, 824, 519, 435, 487, 408, 663, 5132]],
  ['2018-08-17T00:00:00Z', [21043, 3054, 2105, 1240, 325, 304, 184, 203, 267, 290, 3102]],
  ['2018-08-18T00:00:00Z', [14196, 1777, 1505, 883, 316, 238, 204, 119, 111, 160, 1714]],
  ['2018-08-19T00:00:00Z', [12646, 2174, 1769, 1050, 331, 294, 159, 275, 144, 175, 2071]],
  ['2018-08-20T00:00:00Z', [14393, 1883, 1810, 1051, 274, 349, 313, 221, 134, 158, 2045]],
  ['2018-08-21T00:00:00Z', [14785, 1754, 1456, 1049, 282, 284, 304, 160, 230, 121, 1776]],
  ['2018-08-22T00:00:00Z', [14420, 2184, 1660, 1030, 202, 286, 158, 128, 178, 85, 1743]]
];
