import { Component } from '@angular/core';
import { AuthService } from 'ngx-prx-styleguide';
import { CmsService, HalDoc } from './core';
import { Env } from './core/core.env';

@Component({
  selector: 'metrics-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  authHost = Env.AUTH_HOST;
  authClient = Env.AUTH_CLIENT_ID;

  loggedIn = true; // until proven otherwise
  userName: string;
  userImageDoc: HalDoc;

  constructor(
    private auth: AuthService,
    private cms: CmsService
  ) {
    auth.token.subscribe(token => this.loadAccount(token));
  }

  loadAccount(token: string) {
    if (token) {
      this.loggedIn = true;
      this.cms.individualAccount.subscribe(doc => {
        this.userImageDoc = doc;
        this.userName = doc['name'];
      });
    } else {
      this.loggedIn = false;
      this.userImageDoc = null;
      this.userName = null;
    }
  }
}
