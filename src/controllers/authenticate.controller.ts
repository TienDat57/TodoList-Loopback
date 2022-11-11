import {inject} from '@loopback/core';
import {get, getModelSchemaRef, HttpErrors, post, requestBody, ResponseObject} from '@loopback/rest';
import {repository} from '@loopback/repository';
import {SecurityBindings,securityId, UserProfile} from '@loopback/security';
import {OPERATION_SECURITY_SPEC, TokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';

import {CAuthenticate} from './router';
import {Users} from '../models';
import {Credentials, UsersRepository} from '../repositories';
import {
  BcryptHasher,
  JWTService,
  MyUserService,
  validateCredentials,
} from '../services';
import { CredentialsRequestBody } from '../services/credentialRequestBody';
import _ from 'lodash';
import {authenticate} from '@loopback/authentication';

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
    public jwtService: JWTService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UsersRepository) protected userRepository: UsersRepository,
  ) { }

  @post(CAuthenticate.REGISTER, {
    responses: {
      '200': AUTHENTICATE,
    },
  })
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            title: 'NewUser',
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    newUserRequest: Omit<Users, 'id'>,
  ): Promise<Users> {
    await validateCredentials(
      _.pick(newUserRequest, ['email', 'password']),
      this.userRepository
    );
    try {
      newUserRequest.password = await new BcryptHasher().hashPassword(newUserRequest.password);
      const savedUser = await this.userRepository.create({
        ...newUserRequest,
        'createdAt': new Date(),
        'updatedAt': new Date(),
      });
      return savedUser;
    }
    catch (error) {
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      }
      else {
        throw error;
      }
    }
  }

  @post(CAuthenticate.LOGIN, {
    responses: {
      '200': AUTHENTICATE,
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({token});
  }

  @get(CAuthenticate.ME, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: 'application/json',
      },
    },
  })
  @authenticate('jwt')
  async currentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Users> {
    const userId: string = currentUserProfile[securityId];
    const userDetail: Users = await this.userRepository.findById(userId);
    return userDetail;
  }

  @get(CAuthenticate.LOGOUT, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Logout',
        content: 'application/json',
      },
    },
  })
  @authenticate('jwt')
  async logout(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Users> {
    const userId: string = currentUserProfile[securityId];
    const userDetail: Users = await this.userRepository.findById(userId);
    return userDetail;
  }
}
