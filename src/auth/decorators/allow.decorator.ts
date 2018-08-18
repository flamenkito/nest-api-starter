import { ReflectMetadata } from '@nestjs/common';

export const Access = (roles: string | string[]) => {
  return ReflectMetadata('roles', Array.isArray(roles) ? roles : [roles]);
};

export namespace Allow {
  export const ADMIN = 'admin';
  export const SUPER = 'super';
  export const USER = 'user';
  export const LOGGED = [ADMIN, SUPER, USER];
  export const PUBLIC = 'public';
  export const WHITELIST = 'whitelist';
}
