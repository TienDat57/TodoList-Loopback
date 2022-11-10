import { UserService } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { securityId, UserProfile } from '@loopback/security';
import { PasswordHasherBindings } from '../keys';
import { UsersRepository, Credentials } from '../repositories';
import { Users } from '../models';

import { BcryptHasher } from './hash.password';

export class MyUserService implements UserService<Users, Credentials>{
  constructor(
    @repository(UsersRepository)
    public userRepository: UsersRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher

  ) { }
  async verifyCredentials(credentials: Credentials): Promise<Users> {
    // implement this method
    const foundUser = await this.userRepository.findOne({
      where: {
        email: credentials.email
      }
    });
    if (!foundUser) {
      throw new HttpErrors.NotFound('user not found');
    }
    const passwordMatched = await this.hasher.comparePassword(credentials.password, foundUser.password)
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('password is not valid');
    }
    return foundUser;
  }

  convertToUserProfile(user: Users): UserProfile {
    return {
      [securityId]: user.id!.toString(),
      id: user.id,
      email: user.email,
    };
  }

}
