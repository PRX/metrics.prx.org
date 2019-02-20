import { ExportGoogleSheetsService } from './export-google-sheets.service';

declare const gapi: any;

describe('ExportGoogleSheetsService', () => {
  window['gapi'] = {
    auth2: {
      getAuthInstance: () => {}
    },
    client: {}
  };

  it('should ignore requests if the google api is not loaded', () => {
    jest.spyOn(gapi.auth2, 'getAuthInstance');
    const googleSheets = new ExportGoogleSheetsService();
    googleSheets.signIn();
    expect(gapi.auth2.getAuthInstance).not.toHaveBeenCalled();
  });
});
