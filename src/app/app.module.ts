import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from 'ngx-prx-styleguide';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { routing, routingProviders, routingComponents } from './app.routing';

import { ErrorService } from './error';
import { CoreModule } from './core';
import { SharedModule } from './shared';

import { PodcastReducer } from './ngrx/reducers/podcast.reducer';
import { EpisodeReducer } from './ngrx/reducers/episode.reducer';
import { PodcastMetricsReducer } from './ngrx/reducers/podcast-metrics.reducer';
import { EpisodeMetricsReducer } from './ngrx/reducers/episode-metrics.reducer';

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
    StoreModule.provideStore({
      podcast: PodcastReducer,
      episode: EpisodeReducer,
      podcastMetrics: PodcastMetricsReducer,
      episodeMetrics: EpisodeMetricsReducer
    }),
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

