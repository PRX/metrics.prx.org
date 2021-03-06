import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

import { NavMenuContainerComponent } from './nav-menu-container.component';
import { NavMenuPresentationComponent } from './nav-menu-presentation.component';

import { reducers } from '@app/ngrx/reducers';
import * as ACTIONS from '@app/ngrx/actions';
import { routerParams } from '@testing/downloads.fixtures';

describe('NavMenuContainerComponent', () => {
  let comp: NavMenuContainerComponent;
  let fix: ComponentFixture<NavMenuContainerComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavMenuContainerComponent, NavMenuPresentationComponent],
      imports: [StoreModule.forRoot(reducers)]
    })
      .compileComponents()
      .then(() => {
        fix = TestBed.createComponent(NavMenuContainerComponent);
        comp = fix.componentInstance;
        fix.detectChanges();
        de = fix.debugElement;
        el = de.nativeElement;
        store = TestBed.inject(Store);

        store.dispatch(ACTIONS.CustomRouterNavigation({ routerParams }));

        jest.spyOn(store, 'dispatch');
      });
  }));

  it('should have router params', done => {
    comp.routerParams$.pipe(first()).subscribe(params => {
      expect(params).toEqual(routerParams);
      done();
    });
  });

  it('should dispatch routing action', () => {
    comp.routeMetricsGroupType({ metricsType: routerParams.metricsType, group: routerParams.group });
    expect(store.dispatch).toHaveBeenCalledWith(
      ACTIONS.RouteMetricsGroupType({ metricsType: routerParams.metricsType, group: routerParams.group })
    );
  });
});
