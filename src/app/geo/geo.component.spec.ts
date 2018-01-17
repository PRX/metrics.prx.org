import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { reducers } from '../ngrx/reducers';

import { GeoComponent } from './geo.component';

describe('GeoComponent', () => {
  let comp: GeoComponent;
  let fix: ComponentFixture<GeoComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GeoComponent
      ],
      imports: [
        SharedModule,
        StoreModule.forRoot(reducers),
        RouterTestingModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(GeoComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should create the component', async(() => {
    expect(comp).toBeTruthy();
  }));
});
