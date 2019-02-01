import { HalDoc, Userinfo } from 'ngx-prx-styleguide';

export interface User {
  loggedIn: boolean;
  authorized: boolean;
  doc: HalDoc;
  userinfo: Userinfo;
}
