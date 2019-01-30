import { EpisodeSelectDropdownService } from './episode-select-dropdown.service';

describe('EpisodeSelectDropdownService', () => {
  const dropdown = new EpisodeSelectDropdownService();

  it('should toggleOpen', () => {
    expect(dropdown.open).toBeFalsy();
    dropdown.toggleOpen(true);
    expect(dropdown.open).toBeTruthy();
  });

  it('should toggleShowingSelected', () => {
    expect(dropdown.showingSelected).toBeFalsy();
    dropdown.toggleShowingSelected(true);
    expect(dropdown.toggleShowingSelected).toBeTruthy();
  });
});
