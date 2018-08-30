import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';

import { NavMenuContainerComponent } from './nav-menu-container.component';
import { NavMenuPresentationComponent } from './nav-menu-presentation.component';

import { reducers } from '../../ngrx/reducers';
import * as ACTIONS from '../../ngrx/actions';
import { routerParams } from '../../../testing/downloads.fixtures';

describe('NavMenuContainerComponent', () => {
  let comp: NavMenuContainerComponent;
  let fix: ComponentFixture<NavMenuContainerComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavMenuContainerComponent,
        NavMenuPresentationComponent
      ],
      imports: [
        /*RouterTestingModule,*/
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(NavMenuContainerComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
      store = TestBed.get(Store);

      store.dispatch(new ACTIONS.CustomRouterNavigationAction({routerParams}));

      spyOn(store, 'dispatch').and.callThrough();
    });
  }));

  it('should have router params', () => {
    comp.routerParams$.subscribe(params => {
      expect(params).toEqual(routerParams);
    });
  });

  it('should dispatch routing action', () => {
    comp.routeMetricsGroupType({metricsType: routerParams.metricsType, group: routerParams.group});
    expect(store.dispatch).toHaveBeenCalledWith(
      new ACTIONS.RouteMetricsGroupTypeAction({metricsType: routerParams.metricsType, group: routerParams.group}));
  });
});
