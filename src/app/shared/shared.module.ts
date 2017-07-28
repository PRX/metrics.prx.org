import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard, DeactivateGuard, UnauthGuard,
  ImageModule, SpinnerModule } from 'ngx-prx-styleguide';

@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    ImageModule,
    SpinnerModule
  ],
  imports: [
    CommonModule,
    ImageModule,
    SpinnerModule
  ],
  providers: [
    AuthGuard,
    DeactivateGuard,
    UnauthGuard
  ]
})

export class SharedModule { }
