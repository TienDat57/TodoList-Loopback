import {authenticate} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {pick} from 'lodash';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {BcryptHasher} from '../services/hash.password';
import {
  Credentials,
  JWTService,
  MyUserService,
} from '../services';
import { PasswordHasherBindings, TokenServiceBindings, UserServiceBindings} from '../keys';
import {validateCredentials} from '../services/validator.service';
import {CredentialsRequestBody} from '../types/credential-schema';
import { CAuthenticate } from './router';

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
        description: 'Create a new user',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {
              title: 'NewUser',
            }),
          },
        },
      },
    },
  })
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            exclude: ['id'],
          }),
        },
      },
    })
    userData: Omit<User, 'id'>,
  ) {
    validateCredentials(pick(userData, ['email', 'password']), this.userRepository);

    const hashedPassword = await this.hasher.hashPassword(userData.password);
    const newUser = await this.userRepository.create({
      email: userData.email,
      password: hashedPassword,

    });
    return newUser;
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
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({token});
  }
}
