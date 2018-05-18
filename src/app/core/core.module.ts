import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FooterModule, HalModule, HeaderModule, ModalModule, ModalService } from 'ngx-prx-styleguide';

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
