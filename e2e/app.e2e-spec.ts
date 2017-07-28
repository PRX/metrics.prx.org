import { Metrics.Prx.OrgPage } from './app.po';

describe('metrics.prx.org App', () => {
  let page: Metrics.Prx.OrgPage;

  beforeEach(() => {
    page = new Metrics.Prx.OrgPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
