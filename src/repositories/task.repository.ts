import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Project, TaskRelations, Tasks, User} from '../models';
import {ProjectRepository} from './project.repository';
import {UserRepository} from './user.repository';

export class TaskRepository extends DefaultCrudRepository<
  Tasks,
  typeof Tasks.prototype.id,
  TaskRelations
> {

  public readonly project: BelongsToAccessor<Project, typeof Tasks.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Tasks.prototype.id>;

  public readonly linkedToTask: BelongsToAccessor<Tasks, typeof Tasks.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('TaskRepository') protected taskRepositoryGetter: Getter<TaskRepository>,
  ) {
    super(Tasks, dataSource);
    this.linkedToTask = this.createBelongsToAccessorFor(
      'linkedToo',
      Getter.fromValue(this),
    ); // for recursive relationship
    this.registerInclusionResolver('linkedToo', this.linkedToTask.inclusionResolver);

    this.user = this.createBelongsToAccessorFor('assignedTo', userRepositoryGetter,);
    this.registerInclusionResolver('assignedTo', this.user.inclusionResolver);
    this.project = this.createBelongsToAccessorFor('ofProject', projectRepositoryGetter,);
    this.registerInclusionResolver('ofProject', this.project.inclusionResolver);
  }
}
