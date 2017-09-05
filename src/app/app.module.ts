import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from 'ngx-prx-styleguide';

import { AppComponent } from './app.component';
import { routing, routingProviders, routingComponents } from './app.routing';

import { ErrorService } from './error';
import { CoreModule } from './core';
import { SharedModule } from './shared';

import { DownloadsModule } from './downloads/downloads.module';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AuthModule,
    SharedModule,
    routing,
    DownloadsModule
  ],
  providers: [
    {provide: ErrorHandler, useClass: ErrorService},
    routingProviders
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

