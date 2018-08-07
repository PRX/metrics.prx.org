import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { Angulartics2 } from 'angulartics2';
import { HalService, MockHalService } from 'ngx-prx-styleguide';
import { CastleService } from '../core';
import { SharedModule } from '../shared';
import { HomeComponent } from './home.component';

import { reducers } from '../ngrx/reducers';
import { CastlePodcastPageFailureAction } from '../ngrx/actions';

describe('HomeComponent', () => {
  let comp: HomeComponent;
  let fix: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const mockHal = new MockHalService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
        StoreModule.forRoot(reducers)
      ],
      declarations: [ HomeComponent ],
      providers : [
        CastleService,
        {provide: HalService, useValue: mockHal},
        {provide: Angulartics2}
      ]
    })
    .compileComponents().then(() => {
      fix = TestBed.createComponent(HomeComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should be created', () => {
    expect(comp).toBeTruthy();
  });

  it('should inform users if they don\'t have any podcasts', () => {
    comp.store.dispatch(new CastlePodcastPageFailureAction({error: 'error is type any so we can also capture response errors'}));
    fix.detectChanges();
    expect(de.query(By.css('p.error'))).not.toBeNull();
  });
});
