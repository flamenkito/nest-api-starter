import { ReflectMetadata } from '@nestjs/common';

export const index = (params) => {
  return ReflectMetadata('index', params);
};
