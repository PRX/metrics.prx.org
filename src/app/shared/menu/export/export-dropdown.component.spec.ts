import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { DebugElement } from '@angular/core';

import { reducers } from '../../../ngrx/reducers';
import { ExportDropdownComponent } from './export-dropdown.component';

describe('ExportDropdownComponent', () => {
  let comp: ExportDropdownComponent;
  let fix: ComponentFixture<ExportDropdownComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExportDropdownComponent
      ],
      imports: [
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(ExportDropdownComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);
    });
  }));

  it('should close the dropdown on window scroll', done => {
    comp.open = true;
    window.addEventListener('scroll', (e) => {
      expect(comp.open).toBeFalsy();
      done();
    });
    window.dispatchEvent(new Event('scroll'));
  });
});
