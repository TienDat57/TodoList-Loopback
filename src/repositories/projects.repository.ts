import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Project, ProjectRelations, ProjectsUser, Tasks} from '../models';
import {UserProjectRepository} from './projectUser.repository';
import {TaskRepository} from './task.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly tasks: HasManyRepositoryFactory<Tasks, typeof Project.prototype.id>;

  public readonly projectsUser: HasManyRepositoryFactory<ProjectsUser, typeof Project.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: MongoDataSource, @repository.getter('TaskRepository') protected taskRepositoryGetter: Getter<TaskRepository>, @repository.getter('UserProjectRepository') protected userProjectRepositoryGetter: Getter<UserProjectRepository>,
  ) {
    super(Project, dataSource);
    this.projectsUser = this.createHasManyRepositoryFactoryFor('projectsUser', userProjectRepositoryGetter,);
    this.registerInclusionResolver('projectsUser', this.projectsUser.inclusionResolver);
    this.tasks = this.createHasManyRepositoryFactoryFor('tasks', taskRepositoryGetter,);
    this.registerInclusionResolver('tasks', this.tasks.inclusionResolver);
  }
}
