import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { EpisodeSearchComponent } from './episode-search.component';

describe('EpisodeSearchComponent', () => {
  let comp: EpisodeSearchComponent;
  let fix: ComponentFixture<EpisodeSearchComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EpisodeSearchComponent
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(EpisodeSearchComponent);
      comp = fix.componentInstance;
      de = fix.debugElement;
      el = de.nativeElement;

      fix.detectChanges();
    });
  }));

  it('should debounce search input', fakeAsync(() => {
    jest.spyOn(comp.search, 'emit');
    comp.onEpisodeSearch('articles');
    tick(501);
    expect(comp.search.emit).toHaveBeenCalledTimes(1);
    comp.onEpisodeSearch('articles of');
    expect(comp.search.emit).toHaveBeenCalledTimes(1); // debounceTime(500)
    tick(501);
    expect(comp.search.emit).toHaveBeenCalledTimes(2);
    comp.onEpisodeSearch('articles of');
    tick(501);
    expect(comp.search.emit).toHaveBeenCalledTimes(2); // distinctUntilChanged()
    comp.onEpisodeSearch('articles of interest');
    tick(501);
    expect(comp.search.emit).toHaveBeenCalledTimes(3);
  }));
});
