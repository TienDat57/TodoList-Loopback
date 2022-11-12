import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {User, UserRelations, Task, ProjectUser} from '../models';
import {TaskRepository} from './task.repository';
import {ProjectUserRepository} from './user-project.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly tasks: HasManyRepositoryFactory<Task, typeof User.prototype.id>;

  public readonly userProjects: HasManyRepositoryFactory<ProjectUser, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: MongoDataSource, @repository.getter('TaskRepository') protected taskRepositoryGetter: Getter<TaskRepository>, @repository.getter('UserProjectRepository') protected userProjectRepositoryGetter: Getter<ProjectUserRepository>,
  ) {
    super(User, dataSource);
    this.userProjects = this.createHasManyRepositoryFactoryFor('userProjects', userProjectRepositoryGetter,);
    this.registerInclusionResolver('userProjects', this.userProjects.inclusionResolver);
    this.tasks = this.createHasManyRepositoryFactoryFor('tasks', taskRepositoryGetter,);
    this.registerInclusionResolver('tasks', this.tasks.inclusionResolver);
  }
}
