import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Project, TaskRelations, Tasks, Users} from '../models';
import {ProjectRepository} from './projects.repository';
import {UsersRepository} from './users.repository';

export class TaskRepository extends DefaultCrudRepository<
  Tasks,
  typeof Tasks.prototype.id,
  TaskRelations
> {

  public readonly project: BelongsToAccessor<Project, typeof Tasks.prototype.id>;

  public readonly user: BelongsToAccessor<Users, typeof Tasks.prototype.id>;

  public readonly linkedToTask: BelongsToAccessor<Tasks, typeof Tasks.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: MongoDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UsersRepository>, @repository.getter('TaskRepository') protected taskRepositoryGetter: Getter<TaskRepository>,
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
