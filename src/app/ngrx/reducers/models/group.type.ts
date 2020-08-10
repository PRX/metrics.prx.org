import {
  MetricsType,
  METRICSTYPE_DEMOGRAPHICS,
  METRICSTYPE_DOWNLOADS,
  METRICSTYPE_DROPDAY,
  METRICSTYPE_LISTENERS,
  METRICSTYPE_TRAFFICSOURCES
} from './metrics.type';

export const GROUPTYPE_AGENTNAME = 'agentname';
export const GROUPTYPE_AGENTOS = 'agentos';
export const GROUPTYPE_AGENTTYPE = 'agenttype';
export const GROUPTYPE_GEOCOUNTRY = 'geocountry';
export const GROUPTYPE_GEOMETRO = 'geometro';
export const GROUPTYPE_GEOSUBDIV = 'geosubdiv';
export type GroupType = 'agentname' | 'agentos' | 'agenttype' | 'geocountry' | 'geometro' | 'geosubdiv';

export const getGroupName = (metricsType: MetricsType, group: GroupType) => {
  switch (metricsType) {
    case METRICSTYPE_DOWNLOADS:
      return 'Downloads';
    case METRICSTYPE_DROPDAY:
      return 'Drop Day';
    case METRICSTYPE_LISTENERS:
      return 'Unique Listeners';
    case METRICSTYPE_DEMOGRAPHICS:
      switch (group) {
        case GROUPTYPE_GEOCOUNTRY:
          return 'Country';
        case GROUPTYPE_GEOMETRO:
          return 'Metro';
        case GROUPTYPE_GEOSUBDIV:
          return 'State/Province';
      }
      break;
    case METRICSTYPE_TRAFFICSOURCES:
      switch (group) {
        case GROUPTYPE_AGENTOS:
          return 'Operating System';
        case GROUPTYPE_AGENTTYPE:
          return 'Form Factor';
        case GROUPTYPE_AGENTNAME:
          return 'App & Browser';
      }
      break;
  }
};
