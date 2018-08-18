import { createParamDecorator } from '@nestjs/common';

import { environment } from 'shared/environment';

export const Bearer = createParamDecorator(
  (data, req): string => {
    return req[environment.request.bearer] as string;
  },
);
