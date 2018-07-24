export const KEY_ROUTER_PARAMS = 'routerParams';

export const setItem = (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val));

export const getItem = (key: string) => JSON.parse(localStorage.getItem(key));
