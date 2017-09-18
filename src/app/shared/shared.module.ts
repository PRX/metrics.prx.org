import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard, DeactivateGuard, UnauthGuard,
  ChartsModule, DatepickerModule, ImageModule, SpinnerModule } from 'ngx-prx-styleguide';

@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    ChartsModule,
    DatepickerModule,
    ImageModule,
    SpinnerModule
  ],
  imports: [
    CommonModule,
    ChartsModule,
    DatepickerModule,
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
