import { Injectable } from '@angular/core';

@Injectable()
export class EpisodeSelectDropdownService {
  open = false;
  showingSelected = false;
  toggleOpen(open: boolean) {
    this.open = open;
  }
  toggleShowingSelected(showingSelected: boolean) {
    this.showingSelected = showingSelected;
  }
}
