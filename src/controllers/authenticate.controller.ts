import { inject } from '@loopback/core';
import { Request, RestBindings, ResponseObject, post } from '@loopback/rest';

const AUTHENTICATE : ResponseObject = {
  description: 'Authenticate Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'AuthenticateResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

export class AuthenticateController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @post('/auth/login', {
    responses: {
      '200': AUTHENTICATE,
    },
  })
  async login(): Promise<object> {
    return {
      greeting: 'Hello from Login',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @post('/auth/register', {
    responses: {
      '200': AUTHENTICATE,
    },
  })
  async register(): Promise<object> {
    return {
      greeting: 'Hello from register',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}

