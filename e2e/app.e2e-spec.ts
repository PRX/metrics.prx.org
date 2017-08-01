import { MetricsPrxOrgPage } from './app.po';

describe('metrics.prx.org App', () => {
  let page: MetricsPrxOrgPage;

  beforeEach(() => {
    page = new MetricsPrxOrgPage();
  });

  it('should display PRX in header', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('PRX');
  });
});
