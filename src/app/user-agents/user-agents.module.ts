import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { UserAgentsComponent } from './user-agents.component';

import { userAgentsRouting } from './user-agents.routing';

@NgModule({
  declarations: [
    UserAgentsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    userAgentsRouting
  ]
})

export class UserAgentsModule { }
