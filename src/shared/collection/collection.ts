import { CouchDbConfig } from 'shared/models';

import * as clc from 'cli-color';
import { EntityParams } from './entity.params';

// import PouchDB from 'pouchdb';
const PouchDB = require('pouchdb')
  .plugin(require('pouchdb-find'))
  .plugin(require('pouchdb-authentication'))
  .plugin(require('pouchdb-security-helper'));

export class Collection<Model> {
  private localDb: PouchDB.Database;
  private remoteDb: PouchDB.Database;

  private async createLocalDb() {
    const localDb = new PouchDB(this.params.name);
    const fields = this.params.index;
    if (fields.length > 0) {
      localDb.createIndex({ index: { fields } });
    }
    return localDb;
  }

  private getRemoteName() {
    const { admin } = this.config;
    return this.config.user
      ? `${this.config.user.name}${this.params.name}`
      : `${admin.name}${this.params.name}`;
  }

  private async createRemoteSync(localDb: PouchDB.Database) {
    const { host, admin } = this.config;

    const pouchOpts = {
      skip_setup: false,
    };

    const ajaxOpts = {
      ajax: {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(admin.name + ':' + admin.pass).toString('base64'),
          Referer: host,
        },
      },
    };

    const remoteName = this.getRemoteName();

    /* temp */ const _host = host.replace(
      '://',
      `://${admin.name}:${admin.pass}@`,
    );
    /* temp */ const remoteDb = new PouchDB(
      `${_host}/${remoteName}`,
      pouchOpts,
    );

    await remoteDb.logIn(admin.name, admin.pass, ajaxOpts);

    // add a member to db
    if (this.config.user) {
      const { name, pass } = this.config.user;
      // setup user
      try {
        const user = await remoteDb.getUser(name);
      } catch (err) {
        if (err.status === 404) {
          await remoteDb.signUp(name, pass);
          console.log(clc.magenta('Collection remote, user created'), name);
        }
        console.log(err);
      }
      // setup _security
      const security = remoteDb.security();
      security.fetch().then(() => {
        if (!security.nameHasAccess(name)) {
          console.log(clc.magenta('Collection remote, adding user'), name);
          security.members.names.add(name);
          return security.save();
        }
      });
    }

    localDb
      .sync(remoteDb, { live: true, retry: true })
      .on('error', error => {
        console.log(clc.red('Collection ERROR'), error);
      })
      .on('change', res => {
        const { docs_read, docs_written } = res.change;
        console.log(
          clc.magenta('Collection change'),
          `[${remoteName}] read ${docs_read}, written ${docs_written}`,
        );
      });

    return remoteDb;
  }

  private async setup() {
    this.localDb = await this.createLocalDb();
    if (this.config) {
      this.remoteDb = await this.createRemoteSync(this.localDb);
    }
  }

  constructor(
    private readonly params: EntityParams<Model>,
    private readonly config?: CouchDbConfig,
  ) {
    this.setup()
      .then(res => {
        console.log(clc.green('Collection remote'), this.params.name);
      })
      .catch(err => {
        console.error(clc.red('Collection ERROR', err));
      });
  }

  getRemoteDb(): Collection.RemoteDb {
    const remoteDb = this.getRemoteName();
    const host = `${this.config.host}/${remoteDb}`;
    const { name, pass } = this.config.user;
    return { host, name, pass };
  }

  async find(selector?: { [key: string]: any }): Promise<Model[]> {
    // TODO: refactor (index type?)
    const { docs } = await this.localDb.find({
      selector: {
        ...selector,
        type: this.params.name,
      },
    });
    return docs.map(doc => this.params.fromArgs(doc));
  }

  async findOne(selector: { [key: string]: any } = {}): Promise<Model> {
    const docs = await this.find(selector);
    if (docs.length === 1) {
      return docs[0];
    }
  }

  async post(item: Partial<Model>) {
    this.localDb.post({
      ...(item as any),
      type: this.params.name,
    });
  }

  async remove(item: Collection.Node) {
    this.localDb.remove(item);
  }

  async forEach(consumer: (item: Model) => void) {
    const docs = await this.find();
    docs.forEach(doc => consumer(doc));
  }
}

export namespace Collection {
  export interface Node {
    _id: string;
    _rev: string;
    type: string;
  }

  export namespace Node {
    export function fromArgs(args) {
      const { _id, _rev, type } = args;
      return { _id, _rev, type };
    }
  }

  export interface RemoteDb {
    host: string;
    name: string;
    pass: string;
  }
}
