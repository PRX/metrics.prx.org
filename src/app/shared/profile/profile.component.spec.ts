import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { reducers } from '../../ngrx/reducers';

import { ProfileComponent } from './profile.component';

describe('UserAgentsComponent', () => {
  let comp: ProfileComponent;
  let fix: ComponentFixture<ProfileComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileComponent
      ],
      imports: [
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(ProfileComponent);
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
