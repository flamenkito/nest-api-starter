import { createParamDecorator } from '@nestjs/common';

import { environment } from 'shared/environment';

import { PayloadModel } from '../models';

export const Payload = createParamDecorator(
  (data, req): PayloadModel => {
    return req[environment.request.payload] as PayloadModel;
  },
);
