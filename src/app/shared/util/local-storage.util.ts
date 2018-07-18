export const KEY_ROUTER_STATE = 'routerState';

export const setItem = (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val));

export const getItem = (key: string) => JSON.parse(localStorage.getItem(key));
