import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { AuthModule } from 'ngx-prx-styleguide';
import { StoreModule } from '@ngrx/store';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

import { AppComponent } from './app.component';
import { routing, routingProviders, routingComponents } from './app.routing';

import { ErrorService } from './error';
import { CoreModule } from './core';
import { SharedModule } from './shared';

import { reducers } from './ngrx/reducers';
import { RoutingEffects } from './ngrx/effects/routing.effects';
import { CmsEffects } from './ngrx/effects/cms.effects';

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
    StoreModule.forRoot({...reducers, routerReducer: routerReducer}),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    StoreRouterConnectingModule,
    EffectsModule.forRoot([RoutingEffects, CmsEffects]),
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

