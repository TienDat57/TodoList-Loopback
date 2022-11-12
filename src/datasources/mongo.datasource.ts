import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import { juggler } from '@loopback/repository';

require('dotenv').config();

const config = {
  name: 'db',
  connector: 'mongodb',
  url: process.env.DB_LOCALHOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT ?? 3001,
};

@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'db';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.db', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
