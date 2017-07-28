import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs/Subject';

import { AuthModule, AuthService, ModalModule, ModalService } from 'ngx-prx-styleguide';
import { CoreModule, CmsService } from './core';
import { SharedModule } from './shared';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let comp: AppComponent;
  let fix: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        CoreModule,
        AuthModule,
        ModalModule,
        RouterTestingModule,
        SharedModule
      ]
    }).compileComponents().then(() => {
      fix = TestBed.createComponent(AppComponent);
      comp = fix.componentInstance;
      fix.detectChanges();
      de = fix.debugElement;
      el = de.nativeElement;
    });
  }));

  it('should create the app', async(() => {
    expect(comp).toBeTruthy();
  }));

  it(`should only show header links when logged in`, async(() => {
    comp.loggedIn = true;
    fix.detectChanges();
    expect(de.queryAll(By.css('prx-navitem')).length).toEqual(2);
    comp.loggedIn = false;
    fix.detectChanges();
    expect(de.query(By.css('prx-navitem'))).toBeNull();
  }));

  it('should show user info when logged in', async(() => {
    comp.loggedIn = true;
    fix.detectChanges();
    expect(de.query(By.css('prx-navuser'))).toBeTruthy();
    comp.loggedIn = false;
    fix.detectChanges();
    expect(de.query(By.css('prx-navuser'))).toBeNull();
  }));
});
