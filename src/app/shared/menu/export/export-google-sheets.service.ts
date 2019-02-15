import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { finalize } from 'rxjs/operators/finalize';
import { Env } from '../../../core/core.env';

declare const gapi: any;

export interface GoogleSheet {
  title: string;
  sheets: {title: string, data: any[][]}[];
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  error?: string;
}

@Injectable()
export class ExportGoogleSheetsService {
  private signedIn = false;

  constructor() {
    this.initGoogleAPI();
  }

  initGoogleAPI() {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        'apiKey': Env.GOOGLE_API_KEY,
        'clientId': Env.GOOGLE_CLIENT_ID,
        'scope': 'https://www.googleapis.com/auth/spreadsheets',
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      }).then(() => {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignedInStatus);

        // Handle the initial sign-in state.
        this.updateSignedInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    });
  }

  updateSignedInStatus(signedIn) {
    this.signedIn = signedIn;
  }

  signIn() {
    gapi.auth2.getAuthInstance().signIn();
  }

  get isSignedIn(): boolean {
    return this.signedIn;
  }

  createSpreadsheet(googleSheet: GoogleSheet): Observable<GoogleSheet> {
    if (this.signedIn) {
      return from(
        gapi.client.sheets.spreadsheets.create({}, {
          properties: {
            title: googleSheet.title
          },
          sheets: googleSheet.sheets.map(sheet => ({properties: {title: sheet.title}}))
        }).then((response) => {
          googleSheet.spreadsheetUrl = response.result.spreadsheetUrl;
          googleSheet.spreadsheetId = response.result.spreadsheetId;
          return gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: googleSheet.spreadsheetId,
            range: googleSheet.sheets[0].title,
            valueInputOption: 'RAW',
            resource: {values: googleSheet.sheets[0].data}
          });
        })
        .then(() => {
          return googleSheet;
        })
        .catch(reason => { // update error || create error
          return {...googleSheet, error: reason.message || reason.result.error.message};
        })
      );
    }
  }
}
