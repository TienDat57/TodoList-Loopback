import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import { juggler } from '@loopback/repository';

require('dotenv').config();

const config = {
  name: 'db',
  connector: 'mongodb',
  url: 'mongodb+srv://TienDat57:Tiendat572002@trelloclone.gzzswit.mongodb.net/Trello',
  user: process.env.DB_USER || 'TienDat57',
  password: process.env.DB_PASSWORD || 'Tiendat572002',
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
