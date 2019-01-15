import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { GeochartMapComponent } from './geochart.map.component';

describe('GeochartMapComponent', () => {
  let comp: GeochartMapComponent;
  let fix: ComponentFixture<GeochartMapComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GeochartMapComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(GeochartMapComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should redraw map on window resize', done => {
    jest.spyOn(comp, 'drawMap').mockImplementation(() => {});
    window.addEventListener('resize', (e) => {
      expect(comp.drawMap).toHaveBeenCalled();
      done();
    });
    window.dispatchEvent(new Event('resize'));
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
});
