import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterModule, HalModule, HeaderModule, ModalModule, ModalService } from 'ngx-prx-styleguide';

import { CastleService } from './hal';
import { RoutingService } from './routing/routing.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HalModule
  ],
  exports: [
    FooterModule,
    HeaderModule,
    ModalModule
  ],
  providers: [
    CastleService,
    ModalService,
    RoutingService
  ]
})

export class CoreModule {

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }

}
