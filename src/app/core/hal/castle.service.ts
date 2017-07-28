import { Injectable } from '@angular/core';
import { HalBaseService } from 'ngx-prx-styleguide';
import { Env } from '../core.env';

@Injectable()
export class CastleService extends HalBaseService {

  get host(): string {
    return Env.CASTLE_HOST;
  }

  get path(): string {
    return '/api/v1';
  }

  get ttl(): number {
    return Env.CMS_TTL;
  }

}
