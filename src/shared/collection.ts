// import PouchDB from 'pouchdb';
const PouchDB = require('pouchdb').plugin(require('pouchdb-find'));

export class Collection<Model> {
  private db: PouchDB.Database;

  constructor(
    private readonly type: string,
    private readonly fields: string[] = [],
    private readonly mapper: (args) => Model,
  ) {
    this.db = new PouchDB(type);
    if (fields.length > 0) {
      this.db.createIndex({ index: { fields } });
    }
  }

  async find(selector?: { [key: string]: any }): Promise<Model[]> {
    // TODO: refactor (index type?)
    const { docs } = await this.db.find({
      selector: {
        ...selector,
        type: this.type,
      },
    });
    return docs.map(doc => this.mapper(doc));
  }

  async findOne(selector: { [key: string]: any } = {}): Promise<Model> {
    const docs = await this.find(selector);
    if (docs.length === 1) {
      return docs[0];
    }
  }

  async post(item: Partial<Model>) {
    this.db.post({
      ...(item as any),
      type: this.type,
    });
  }

  async remove(item: Collection.NodeModel) {
    this.db.remove(item);
  }

  async forEach(consumer: (item: Model) => void) {
    const docs = await this.find();
    docs.forEach(doc => consumer(doc));
  }
}

export namespace Collection {
  export interface NodeModel {
    _id: string;
    _rev: string;
    type: string;
  }

  export namespace NodeModel {
    export function fromArgs(args) {
      const { _id, _rev, type } = args;
      return { _id, _rev, type };
    }
  }
}
