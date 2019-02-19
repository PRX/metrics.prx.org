import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { Env } from '../../../core/core.env';

declare const gapi: any;

export interface GoogleSheet {
  title: string;
  sheets: {title: string, data: any[][]}[];
  spreadsheetId?: string;
  spreadsheetUrl?: string;
}

export interface GoogleSheetState {
  sheet?: GoogleSheet;
  signedIn: boolean;
  busy: boolean;
  error?: string;
}

const initialState = {
  signedIn: false,
  busy: false
};

@Injectable()
export class ExportGoogleSheetsService {
  private static gapiLoaded: boolean;
  private _state = new BehaviorSubject<GoogleSheetState>(initialState);
  public readonly state: Observable<GoogleSheetState> = this._state.asObservable();
  public readonly busy: Observable<boolean> = this.state.pipe(map(state => state.busy), distinctUntilChanged());

  constructor() {
    this.initGoogleAPI();
  }

  initGoogleAPI() {
    if (!ExportGoogleSheetsService.gapiLoaded
      && Env.GOOGLE_API_KEY && Env.GOOGLE_CLIENT_ID) {
      ExportGoogleSheetsService.gapiLoaded = true;
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
  }

  updateSignedInStatus(signedIn) {
    this._state.next({...this._state.getValue(), signedIn});
  }

  signIn() {
    if (ExportGoogleSheetsService.gapiLoaded) {
      gapi.auth2.getAuthInstance().signIn();
    }
  }

  get isSignedIn(): boolean {
    return this._state.getValue().signedIn;
  }

  createSpreadsheet(googleSheet: GoogleSheet) {
    if (this.isSignedIn && ExportGoogleSheetsService.gapiLoaded) {
      this._state.next({...this._state.getValue(), sheet: googleSheet, busy: true});

      gapi.client.sheets.spreadsheets.create({}, {
        properties: {
          title: googleSheet.title
        },
        sheets: googleSheet.sheets.map(sheet => ({properties: {title: sheet.title}}))
      }).then((response) => {
        googleSheet.spreadsheetUrl = response.result.spreadsheetUrl;
        googleSheet.spreadsheetId = response.result.spreadsheetId;

        this._state.next({...this._state.getValue(), sheet: googleSheet, busy: true});
        return gapi.client.sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: googleSheet.spreadsheetId,
          valueInputOption: 'RAW',
          data: googleSheet.sheets.map(sheet => {
            return {
              range: sheet.title,
              values: sheet.data
            };
          })
        });
      })
      .then(() => {
        this._state.next({...this._state.getValue(), sheet: googleSheet, busy: false});
        return googleSheet;
      })
      .catch(reason => { // update error || create error
        this._state.next({...this._state.getValue(),
          sheet: googleSheet, busy: false, error: reason.message || reason.result.error.message});
      });
    }
  }
}
