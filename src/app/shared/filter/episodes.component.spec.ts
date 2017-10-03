import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SelectModule } from 'ngx-prx-styleguide';
import { EpisodesComponent } from './episodes.component';

import { reducers } from '../../ngrx/reducers';

import { CastleFilterAction } from '../../ngrx/actions';

describe('EpisodesComponent', () => {
  let comp: EpisodesComponent;
  let fix: ComponentFixture<EpisodesComponent>;
  let de: DebugElement;
  let el: HTMLElement;

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
    });
  }));

  it('should initialize episode selections according to filter', () => {
    const filter = {
      episodes: [
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
      ]
    };
    comp.store.dispatch(new CastleFilterAction({filter}));
    expect(comp.selected.length).toEqual(2);
    expect(comp.selected[0].id).toEqual(123);
    expect(comp.selected[1].id).toEqual(124);
  });
});
