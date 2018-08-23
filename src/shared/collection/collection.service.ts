import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ConfigService } from 'shared/config.service';
import { Collection } from './collection';
import { EntityParams } from './entity.params';

@Injectable()
export class CollectionService {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  getRemote<Model extends Collection.Node>(
    model,
    user?: { name: string; pass: string },
  ) {
    const params: EntityParams<Model> = this.reflector.get('params', model);
    const config = {
      ...this.configService.couchdb,
      user,
    };
    return new Collection<Model>(params, config);
  }

  dropRemote() {}
}
