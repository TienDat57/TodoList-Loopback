import {inject} from '@loopback/core';
import {post, requestBody, ResponseObject} from '@loopback/rest';
import {CAuthenticate} from './router';

import {TokenService} from '@loopback/authentication';
import {
  MyUserService, TokenServiceBindings, UserRepository, UserServiceBindings
} from '@loopback/authentication-jwt';
import {repository} from '@loopback/repository';
import {SecurityBindings, UserProfile} from '@loopback/security';

import {Users} from '../models';

const AUTHENTICATE: ResponseObject = {
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
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @post(CAuthenticate.REGISTER, {
    responses: {
      '200': AUTHENTICATE,
    },
  })
  async register(
    @requestBody() user: Users,
  ): Promise<object> {
    const savedUser = await this.userRepository.create(user);
    const userProfile = this.userService.convertToUserProfile(savedUser);
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }
}


