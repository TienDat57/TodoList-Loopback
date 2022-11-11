import {repository} from '@loopback/repository';
import {inject} from '@loopback/core';
import {
  post,
  getModelSchemaRef,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import * as _ from 'lodash';

import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../keys';
import {
  Credentials,
  UserRepository,
} from '../repositories';
import {validateCredentials, JWTService, MyUserService, BcryptHasher} from '../services';
import {CredentialsRequestBody} from '../types/credential-schema';
import {User} from '../models';
import {CAuthenticate} from './router';

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
  ) {}

  @post(CAuthenticate.REGISTER, {
    responses: {
      '200': {
        description: 'Sign up a new user',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    userData: Omit<User, 'id'>,
  ) {
    await validateCredentials(
      _.pick(userData, ['email', 'password']),
      this.userRepository
    );
    try {
      userData.password = await new BcryptHasher().hashPassword(userData.password);
      const savedUser = await this.userRepository.create({
        ...userData,
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
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const userProfile = await this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({token});
  }

}
