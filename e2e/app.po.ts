import { browser, by, element } from 'protractor';

export class MetricsPrxOrgPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('metrics-root h1')).getText();
  }
}
