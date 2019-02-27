//
// DYNAMIC env variables
//

const DEFAULTS = {
  AUTH_HOST: 'id.prx.org',
  AUTH_CLIENT_ID: 'ea0e04f7c85a8d4826dcf2747126a53a95014f51',
  CASTLE_HOST: 'castle.prx.org',
  CASTLE_TTL: 1, // 1 second
  GA_KEY: '',
  GOOGLE_API_KEY: '',
  GOOGLE_CLIENT_ID: ''
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
  public static get AUTH_HOST():             string { return getVar('AUTH_HOST'); }
  public static get AUTH_CLIENT_ID():        string { return getVar('AUTH_CLIENT_ID'); }
  public static get CASTLE_HOST():           string { return getVar('CASTLE_HOST'); }
  public static get CASTLE_TTL():            number { return getVar('CASTLE_TTL'); }
  public static get GA_KEY():                string { return getVar('GA_KEY'); }
  public static get GOOGLE_API_KEY():        string { return getVar('GOOGLE_API_KEY'); }
  public static get GOOGLE_CLIENT_ID():      string { return getVar('GOOGLE_CLIENT_ID'); }
}
