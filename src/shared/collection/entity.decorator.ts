import { ReflectMetadata } from '@nestjs/common';

import { EntityParams } from './entity.params';

export const Entity = (params: EntityParams<{}>) => {
  return ReflectMetadata('params', params);
};
