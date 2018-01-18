import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthModule } from 'ngx-prx-styleguide';
import { LoginComponent } from './login.component';

import { loginRouting } from './login.routing';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthModule,
    loginRouting
  ]
})

export class LoginModule { }
