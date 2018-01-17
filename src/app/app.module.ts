import { NgModule, ErrorHandler, InjectionToken } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { AuthModule } from 'ngx-prx-styleguide';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

import { AppComponent } from './app.component';
import { routing, routingProviders, routingComponents } from './app.routing';

import { ErrorService } from './error';
import { CoreModule } from './core';
import { SharedModule } from './shared';

import { reducers, RootState } from './ngrx/reducers';
import { CastleEffects } from './ngrx/effects/castle.effects';
import { CmsEffects } from './ngrx/effects/cms.effects';
import { GoogleAnalyticsEffects } from './ngrx/effects/google-analytics.effects';
import { RoutingEffects } from './ngrx/effects/routing.effects';

import { DownloadsModule } from './downloads/downloads.module';
import { GeoModule } from './geo/geo.module';
import { UserAgentsModule } from './user-agents/user-agents.module';

// AOT compile doesn't call reducer functions unless they are created with InjectionToken
export function getReducers() {
  return {...reducers, routerReducer: routerReducer};
}

export const reducerToken: InjectionToken<ActionReducerMap<RootState>> =
  new InjectionToken<ActionReducerMap<RootState>>('Reducers');

export const reducerProvider = { provide: reducerToken, useFactory: getReducers };

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
    StoreModule.forRoot(reducerToken),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    StoreRouterConnectingModule,
    EffectsModule.forRoot([CastleEffects, CmsEffects, RoutingEffects, GoogleAnalyticsEffects]),
    routing,
    DownloadsModule,
    GeoModule,
    UserAgentsModule
  ],
  providers: [
    {provide: ErrorHandler, useClass: ErrorService},
    routingProviders,
    reducerProvider
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
