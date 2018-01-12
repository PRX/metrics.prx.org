import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { reducers } from '../ngrx/reducers';

import { UserAgentsComponent } from './user-agents.component';

describe('UserAgentsComponent', () => {
  let comp: UserAgentsComponent;
  let fix: ComponentFixture<UserAgentsComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserAgentsComponent
      ],
      imports: [
        SharedModule,
        StoreModule.forRoot(reducers),
        RouterTestingModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(UserAgentsComponent);
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
