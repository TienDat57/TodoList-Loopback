import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Users, UserRelations} from '../models';

export type Credentials = {
  email: string;
  password: string;
}

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.db') dataSource: MongoDataSource
  ) {
    super(Users, dataSource);
  }
}
