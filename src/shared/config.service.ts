import { Injectable } from '@nestjs/common';

import { join } from 'path';
import { readFileSync } from 'fs';

import { CouchDbConfig } from './models';

@Injectable()
export class ConfigService {
  public readonly couchdb: CouchDbConfig;
  constructor() {
    const couchdb = readFileSync(
      join(__dirname, '..', '..', '..', 'couchdb.json'),
    );
    this.couchdb = JSON.parse(couchdb.toString());
  }
}
