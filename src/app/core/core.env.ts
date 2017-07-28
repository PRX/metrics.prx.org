//
// DYNAMIC env variables
//

const DEFAULTS = {
  CMS_HOST: 'cms.prx.org',
  CMS_TTL: 1, // 1 second
  AUTH_HOST: 'id.prx.org',
  AUTH_CLIENT_ID: 'rWeO7frPqkxmAR378PBlVwEQ0uf4F5u3Fwx8rv1D', // TODO: need a client id for metrics
  CASTLE_HOST: 'castle.prx.org'
};

const addScheme = (name: string, value: any): any => {
  if (name.match(/_HOST$/) && value && !value.startsWith('http')) {
    const scheme = value.match(/.*\.prxu?\.(?:org|tech)$/) ? 'https' : 'http';
    return `${scheme}://${value}`;
  } else {
    return value;
  }
};

const getVar = (name: string): any => {
  if (window && window['ENV'] && window['ENV'][name] !== undefined) {
    return addScheme(name, window['ENV'][name]);
  } else {
    return addScheme(name, DEFAULTS[name]);
  }
};

export class Env {
  public static get CMS_HOST():              string { return getVar('CMS_HOST'); }
  public static get CMS_TTL():               number { return getVar('CMS_TTL'); }
  public static get AUTH_HOST():             string { return getVar('AUTH_HOST'); }
  public static get AUTH_CLIENT_ID():        string { return getVar('AUTH_CLIENT_ID'); }
  public static get CASTLE_HOST():           string { return getVar('CASTLE_HOST'); }
  public static get CASTLE_TEST_EPISODE():   string { return getVar('CASTLE_TEST_EPISODE'); }
}
