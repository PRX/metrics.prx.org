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

  it('should redraw map on window resize', () => {
    spyOn(comp, 'drawMap');
    window.dispatchEvent(new Event('resize'));
    expect(comp.drawMap).toHaveBeenCalled();
  });
});
