import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Project, ProjectsUser, UserProjectRelations, Users} from '../models';
import {ProjectRepository} from './projects.repository';
import {UsersRepository} from './users.repository';

export class UserProjectRepository extends DefaultCrudRepository<
  ProjectsUser,
  typeof ProjectsUser.prototype.id,
  UserProjectRelations
> {

  public readonly project: BelongsToAccessor<Project, typeof ProjectsUser.prototype.id>;

  public readonly user: BelongsToAccessor<Users, typeof ProjectsUser.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: MongoDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UsersRepository>,
  ) {
    super(ProjectsUser, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
  }
}
