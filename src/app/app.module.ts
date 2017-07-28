import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from 'ngx-prx-styleguide';

import { AppComponent } from './app.component';
import { routing, routingProviders, routingComponents } from './app.routing';

import { ErrorService } from './error';
import { CoreModule } from './core';
import { SharedModule } from './shared';

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
    routing
  ],
  providers: [
    {provide: ErrorHandler, useClass: ErrorService},
    routingProviders
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

