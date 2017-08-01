import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'metrics-login',
  styleUrls: ['login.component.css'],
  template: `
    <div class="login">
      <h1>Login</h1>
      <p *ngIf="!errorMsg">You must login to use this app</p>
      <p *ngIf="errorMsg" class="error">{{errorMsg}}</p>
      <prx-login (success)="loginSuccess()" (failure)="loginFailure($event)">
      </prx-login>
    </div>
    `
})

export class LoginComponent {

  errorMsg: string;

  constructor(private router: Router) {}

  loginSuccess() {
    this.errorMsg = null;
    this.router.navigate(['/']);
  }

  loginFailure(reason: string) {
    this.errorMsg = reason;
  }

}
