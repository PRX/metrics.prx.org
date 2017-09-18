import { Component } from '@angular/core';

@Component({
  selector: 'metrics-home',
  template: `
    <metrics-downloads></metrics-downloads>
  `
})
export class HomeComponent {
  // eventually this will have Tabs+TabService (or whatever else we use because Tab uses BaseModel plus we have mobile requirements),
  //  but right now it does nothing but a place to point the router and put downloads
}
