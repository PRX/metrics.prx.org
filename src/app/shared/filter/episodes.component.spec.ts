import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SelectModule } from 'ngx-prx-styleguide';
import { EpisodesComponent } from './episodes.component';

import { reducers } from '../../ngrx/reducers';

import { CastleFilterAction, CmsEpisodeGuidAction } from '../../ngrx/actions';
import { FilterModel } from '../../ngrx/model';

describe('EpisodesComponent', () => {
  let comp: EpisodesComponent;
  let fix: ComponentFixture<EpisodesComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const podcast = {
    doc: undefined,
    seriesId: 37800,
    title: 'Pet Talks Daily'
  };
  const episodes = [
    {
      doc: undefined,
      seriesId: 37800,
      id: 123,
      publishedAt: new Date(),
      title: 'A Pet Talk Episode',
      guid: 'abcdefg'
    },
    {
      doc: undefined,
      seriesId: 37800,
      id: 124,
      publishedAt: new Date(),
      title: 'Another Pet Talk Episode',
      guid: 'gfedcba'
    }
  ];
  const filter: FilterModel = {
    podcast,
    episodes
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EpisodesComponent
      ],
      imports: [
        SelectModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(EpisodesComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;

      comp.store.dispatch(new CastleFilterAction({filter}));
      episodes.forEach(episode => {
        comp.store.dispatch(new CmsEpisodeGuidAction({podcast, episode}));
      });
    });
  }));

  it('should initialize episode selections according to filter', () => {
    expect(comp.selected.length).toEqual(2);
    expect(comp.selected[0].id).toEqual(123);
    expect(comp.selected[1].id).toEqual(124);
  });

  it('should clear episode selections if podcast changes', () => {
    expect(comp.allEpisodeOptions.length).toEqual(2);
    const newFilter = {
      podcast: {
        doc: undefined,
        seriesId: 37801,
        title: 'Totally Not Pet Talks Daily'
      }
    };
    comp.store.dispatch(new CastleFilterAction({filter: newFilter}));
    expect(comp.allEpisodeOptions.length).toEqual(0);
  });
});
