import { Component } from '@angular/core';

@Component ({
  template: `
    <router-outlet name="sidenav"></router-outlet>
    <section class="content soon">coming soon</section>
  `,
  styleUrls: ['../shared/nav/nav-content.css', '../shared/nav/soon.css']
})

export class UserAgentsComponent {}
