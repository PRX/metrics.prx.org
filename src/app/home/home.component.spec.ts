import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let comp: HomeComponent;
  let fix: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ]
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

  it('should greet the user', () => {
    expect(de.query(By.css('p')).nativeElement.innerText).toContain('Hello World!');
  });
});
