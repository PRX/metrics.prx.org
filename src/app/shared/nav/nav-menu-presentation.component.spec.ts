import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import {
  RouterParams, ChartType, MetricsType, GroupType,
  CHARTTYPE_PODCAST, INTERVAL_DAILY,
  METRICSTYPE_DOWNLOADS, METRICSTYPE_DEMOGRAPHICS, METRICSTYPE_TRAFFICSOURCES,
  GROUPTYPE_AGENTOS, GROUPTYPE_GEOCOUNTRY
} from '../../ngrx';

import { NavMenuPresentationComponent } from './nav-menu-presentation.component';

describe('NavMenuPresentationComponent', () => {
  let comp: NavMenuPresentationComponent;
  let fix: ComponentFixture<NavMenuPresentationComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let navLinks;

  const podcasts: any[] = [
    {id: '70', title: 'Podcast 1'},
    {id: '72', title: 'Podcast 2'}
  ];

  const routerParams: RouterParams = {
    podcastId: podcasts[0].id,
    metricsType: <MetricsType>METRICSTYPE_DOWNLOADS,
    chartType: <ChartType>CHARTTYPE_PODCAST,
    interval: INTERVAL_DAILY
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavMenuPresentationComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(NavMenuPresentationComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;

      comp.routerParams = routerParams;

      fix.detectChanges();
      navLinks = de.queryAll(By.css('button.nav'));

      spyOn(comp.navigate, 'emit').and.stub();
    });
  }));

  it('should have navigation to Downloads', () => {
    expect(navLinks.find(link => link.nativeElement.textContent === 'Downloads'.toUpperCase())).not.toBeNull();
    comp.routeMetricsGroupType(METRICSTYPE_DOWNLOADS, <GroupType>'');
    expect(comp.navigate.emit).toHaveBeenCalledWith({metricsType: METRICSTYPE_DOWNLOADS, group: ''});
  });

  it('should have navigation to Demographics', () => {
    expect(navLinks.find(link => link.nativeElement.textContent === 'Demographics'.toUpperCase())).not.toBeNull();
    comp.routeMetricsGroupType(METRICSTYPE_DEMOGRAPHICS, GROUPTYPE_GEOCOUNTRY);
    expect(comp.navigate.emit).toHaveBeenCalledWith({metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY});
  });

  it('should have navigation to Operating System', () => {
    expect(navLinks.find(link => link.nativeElement.textContent === 'Operating System'.toUpperCase())).not.toBeNull();
    comp.routeMetricsGroupType(METRICSTYPE_TRAFFICSOURCES, GROUPTYPE_AGENTOS);
    expect(comp.navigate.emit).toHaveBeenCalledWith({metricsType: METRICSTYPE_TRAFFICSOURCES, group: GROUPTYPE_AGENTOS});
  });

  it('should show dropdown when open', () => {
    expect(de.query(By.css('.dropdown.open'))).toBeNull();
    comp.toggleOpen();
    fix.detectChanges();
    expect(de.query(By.css('.dropdown.open'))).not.toBeNull();
  });

  it('should close the dropdown on window scroll', () => {
    comp.open = true;
    window.dispatchEvent(new Event('scroll'));
    expect(comp.open).toBeFalsy();
  });

  it('should accordion nav sections', () => {
    comp.ngOnChanges();
    expect(comp.types.find(t => t.type === comp.routerParams.metricsType).expanded).toBeTruthy();
    comp.accordionMetricsType(METRICSTYPE_TRAFFICSOURCES);
    expect(comp.types.find(t => t.type === METRICSTYPE_TRAFFICSOURCES).expanded).toBeTruthy();
    expect(comp.types.find(t => t.type === METRICSTYPE_DOWNLOADS).expanded).toBeFalsy();
    expect(comp.types.find(t => t.type === METRICSTYPE_DEMOGRAPHICS).expanded).toBeFalsy();
  });
});
