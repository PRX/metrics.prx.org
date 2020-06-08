import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { AuthModule } from 'ngx-prx-styleguide';
import { StoreModule } from '@ngrx/store';
import { Angulartics2Module } from 'angulartics2';

import { AppComponent } from './app.component';
import { routing, routingProviders, routingComponents } from './app.routing';

import { ErrorService } from './error';
import { CoreModule } from './core';
import { SharedModule } from './shared';

import { reducers, CustomSerializer } from './ngrx/reducers';
import { CastleCatalogEffects } from './ngrx/effects/castle-catalog.effects';
import { CastleDownloadsEffects } from './ngrx/effects/castle-downloads.effects';
import { CastleRanksTotalsEffects } from './ngrx/effects/castle-ranks-totals.effects';
import { GoogleAnalyticsEffects } from './ngrx/effects/google-analytics.effects';
import { IdEffects } from './ngrx/effects/id.effects';
import { RoutingEffects } from './ngrx/effects/routing.effects';

import { DownloadsModule } from './downloads/downloads.module';
import { GeoModule } from './geo/geo.module';
import { LoginModule } from './login/login.module';
import { UserAgentsModule } from './user-agents/user-agents.module';

@NgModule({
  declarations: [AppComponent, routingComponents],
  imports: [
    BrowserModule,
    CoreModule,
    AuthModule,
    SharedModule,
    Angulartics2Module.forRoot(),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 150, // Retains last 150 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    StoreRouterConnectingModule.forRoot({ serializer: CustomSerializer }),
    EffectsModule.forRoot([
      CastleCatalogEffects,
      CastleDownloadsEffects,
      CastleRanksTotalsEffects,
      GoogleAnalyticsEffects,
      IdEffects,
      RoutingEffects,
    ]),
    routing,
    LoginModule,
    DownloadsModule,
    GeoModule,
    UserAgentsModule,
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorService }, routingProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
