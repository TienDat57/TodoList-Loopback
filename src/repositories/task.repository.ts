import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Task, TaskRelations, Project, User} from '../models';
import {ProjectRepository} from './project.repository';
import {UserRepository} from './user.repository';

export class TaskRepository extends DefaultCrudRepository<
  Task,
  typeof Task.prototype.id,
  TaskRelations
> {

  public readonly project: BelongsToAccessor<Project, typeof Task.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Task.prototype.id>;

  public readonly linkedToTask: BelongsToAccessor<Task, typeof Task.prototype.id>;

  public readonly creator: BelongsToAccessor<User, typeof Task.prototype.id>;

  public readonly updater: BelongsToAccessor<User, typeof Task.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: MongoDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('TaskRepository') protected taskRepositoryGetter: Getter<TaskRepository>,
  ) {
    super(Task, dataSource);
    this.updater = this.createBelongsToAccessorFor('updater', userRepositoryGetter,);
    this.registerInclusionResolver('updater', this.updater.inclusionResolver);
    this.creator = this.createBelongsToAccessorFor('creator', userRepositoryGetter,);
    this.registerInclusionResolver('creator', this.creator.inclusionResolver);
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
