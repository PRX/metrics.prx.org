import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ImageModule } from 'ngx-prx-styleguide';
import { AbrevNumberPipe, abrevNumberFormat } from '../pipes/abrev-number.pipe';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let comp: ProfileComponent;
  let fix: ComponentFixture<ProfileComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileComponent,
        AbrevNumberPipe],
      imports: [ImageModule]
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

  it('renders the podcast info', async(() => {
    comp.podcast = <any> {seriesId: 1, title: 'My Podcast'};
    comp.podcastPerformance = {
      seriesId: 1,
      feederId: '70',
      today: 1234,
      this7days: 5678
    };
    fix.detectChanges();
    expect(el.textContent).toContain('My Podcast');
    expect(el.textContent).toContain(abrevNumberFormat(1234));
    expect(el.textContent).toContain(abrevNumberFormat(5678));
  }));

  it('renders the episode info', async(() => {
    comp.episode = <any> {seriesId: 1, id: 2, title: 'My Episode', publishedAt: new Date()};
    comp.episodePerformance = {
      id: 2,
      seriesId: 1,
      guid: 'abcdef',
      today: 1234,
      total: 5678
    };
    fix.detectChanges();
    expect(el.textContent).toContain('My Episode');
    expect(el.textContent).toContain(abrevNumberFormat(1234));
    expect(el.textContent).toContain(abrevNumberFormat(5678));
  }));

  it('outputs button clicks', async(() => {
    let chartedId = null;
    comp.chartEpisode.subscribe(id => chartedId = id);
    comp.episode = <any> {seriesId: 1, id: 2, title: 'My Episode', publishedAt: new Date()};
    fix.detectChanges();
    const button = de.query(By.css('button')).nativeElement;
    expect(button.textContent).toContain('My Episode');
    expect(chartedId).toEqual(null);
    button.click();
    expect(chartedId).toEqual(2);
  }));

  it('should show trend arrows for podcast trends', () => {
    comp.podcastPerformance = {
      seriesId: 1,
      feederId: '70',
      today: 1234,
      yesterday: 1233,
      this7days: 5678,
      previous7days: 5677
    };
    fix.detectChanges();
    expect(de.queryAll(By.css('.trend-up')).length).toEqual(2);
  });
});
