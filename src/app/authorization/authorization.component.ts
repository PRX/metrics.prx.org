import { Component } from '@angular/core';

@Component({
  selector: 'metrics-authorization',
  styleUrls: ['authorization.component.css'],
  template: `
    <div class="error">
      <h1>Sorry</h1>
      <p>You don't have permission to use this application.</p>
    </div>
    `
})

export class AuthorizationComponent {

}
