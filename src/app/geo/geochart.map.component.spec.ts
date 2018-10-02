import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GeochartMapComponent } from './geochart.map.component';
import { SpinnerModule } from 'ngx-prx-styleguide';
import { METRICSTYPE_DEMOGRAPHICS, GROUPTYPE_GEOCOUNTRY } from '../ngrx/reducers/models';

describe('GeochartMapComponent', () => {
  let comp: GeochartMapComponent;
  let fix: ComponentFixture<GeochartMapComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GeochartMapComponent
      ],
      imports: [
        SpinnerModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(GeochartMapComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should redraw map on window resize', () => {
    spyOn(comp, 'drawMap');
    window.dispatchEvent(new Event('resize'));
    expect(comp.drawMap).toHaveBeenCalled();
  });

  it('should use a map width or height dependent on window size', () => {
    comp.windowSize = undefined;
    const defaultSize = comp.getMapWidthOrHeight();
    expect(defaultSize.height).toEqual(320);
    expect(defaultSize.width).toBeUndefined();

    comp.windowSize = {width: 768, height: 1000};
    const size = comp.getMapWidthOrHeight();
    expect(size.width).toEqual(728);
    expect(size.height).toBeUndefined();

    comp.windowSize = {width: 1200, height: 1000};
    const resize = comp.getMapWidthOrHeight();
    expect(resize.height).toEqual(320);
    expect(resize.width).toBeUndefined();
  });

  it('should show a loading spinner when nested data is loading', () => {
    comp.routerParams = {podcastId: '75', metricsType: METRICSTYPE_DEMOGRAPHICS, group: GROUPTYPE_GEOCOUNTRY, filter: 'US'};
    comp.nestedDataLoading = true;
    fix.detectChanges();
    expect(de.query(By.css('prx-spinner'))).not.toBeUndefined();
  });
});
