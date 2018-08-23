import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { environment } from 'shared/environment';

import { Allow } from './decorators';
import { PayloadModel } from './models';

import * as clc from 'cli-color';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  check(request, endpointRoles): boolean {
    const bearer = extractBearer(request.headers);
    // set request (context)
    request[environment.request.bearer] = bearer;

    // skip JWT
    if (endpointRoles.includes(Allow.PUBLIC)) {
      return true;
    }

    // skip JWT for known hosts
    if (endpointRoles.includes(Allow.WHITELIST)) {
      const ipString = getIp(request.connection.remoteAddress);
      const pollerIps = [];
      if (WHITE_LIST.includes(ipString) || pollerIps.includes(ipString)) {
        return true;
      } else {
        console.log(clc.red('JwtGuard'), 'IP is not in whitelist', ipString);
      }
    }

    if (!bearer) {
      return false;
    }

    const payload = PayloadModel.verify(bearer);

    // set request (context)
    request[environment.request.payload] = payload;

    /**
     * Access whitelist:
     *   Check JWT and roles, allow ADMIN all.
     */
    if (
      payload &&
      Array.isArray(payload.roles) &&
      payload.roles.includes(Allow.ADMIN)
    ) {
      return true;
    }
    if (
      payload &&
      Array.isArray(payload.roles) &&
      Array.isArray(endpointRoles)
    ) {
      const intersection = endpointRoles.filter(
        role => payload.roles.indexOf(role) !== -1,
      );
      return intersection.length > 0;
    }
    return false;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const [request, response] = [
      httpContext.getRequest(),
      httpContext.getResponse(),
    ];

    const endpointRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];

    console.log(
      clc.yellow('JwtGuard'),
      request.method,
      request.url,
      endpointRoles,
    );

    try {
      return this.check(request, endpointRoles);
    } catch (err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN);
    }
  }
}

function getIp(ipString: string): string {
  return ipString.replace('::ffff:', '');
}

const WHITE_LIST = [];

function extractBearer(headers: string[]) {
  for (let key in headers) {
    if (key.toLowerCase() === 'authorization') {
      const header = headers[key];
      if (header.startsWith('Bearer')) {
        return header.slice(7);
      }
      break;
    }
  }
}
