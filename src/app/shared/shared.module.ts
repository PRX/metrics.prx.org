import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard, DeactivateGuard, UnauthGuard,
  ChartsModule, ImageModule, SpinnerModule } from 'ngx-prx-styleguide';

@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    ChartsModule,
    ImageModule,
    SpinnerModule
  ],
  imports: [
    CommonModule,
    ChartsModule,
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
