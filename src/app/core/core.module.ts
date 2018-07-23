import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterModule, HalModule, HeaderModule, ModalModule, ModalService, UserinfoService } from 'ngx-prx-styleguide';

import { CastleService, CmsService } from './hal';

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
    CmsService,
    UserinfoService,
    ModalService
  ]
})

export class CoreModule {

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }

}
