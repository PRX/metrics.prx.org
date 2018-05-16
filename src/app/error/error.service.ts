import { Injectable, ErrorHandler } from '@angular/core';
import { ModalService } from 'ngx-prx-styleguide';

@Injectable()
export class ErrorService implements ErrorHandler {

  private defaultHandler: ErrorHandler;

  constructor(private modal: ModalService) {
    this.defaultHandler = new ErrorHandler();
  }

  handleError(err) {
    this.modal.show({
      title: 'Uncaught ' + (err.name || 'Error'),
      body: `
        <p>${err.message}</p>
        <hr/>
        <pre>${err.stack}</pre>
      `,
      secondaryButton: 'Okay',
      height: 400,
      width: 700
    });
    this.defaultHandler.handleError(err);
  }

}
