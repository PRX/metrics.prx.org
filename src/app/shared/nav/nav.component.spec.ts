import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { reducers } from '../../ngrx/reducers';

import { NavComponent } from './nav.component';
import { NavMenuComponent } from './nav-menu.component';
import { ProfileComponent } from '../profile/profile.component';

describe('NavComponent', () => {
  let comp: NavComponent;
  let fix: ComponentFixture<NavComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavComponent,
        NavMenuComponent,
        ProfileComponent
      ],
      imports: [
        RouterTestingModule,
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(NavComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should contain the nav menu', async(() => {
    expect(de.queryAll(By.css('metrics-nav-menu'))).not.toBeNull();
  }));
});
