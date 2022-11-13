import {authenticate} from '@loopback/authentication';
import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ProjectUser,
  Project,
} from '../models';
import {ProjectUserRepository} from '../repositories';

@authenticate('jwt')
export class UserProjectProjectController {
  constructor(
    @repository(ProjectUserRepository)
    public userProjectRepository: ProjectUserRepository,
  ) { }

  @get('/user-projects/{id}/project', {
    responses: {
      '200': {
        description: 'Project belonging to UserProject',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async getProject(
    @param.path.string('id') id: typeof ProjectUser.prototype.id,
  ): Promise<Project> {
    return this.userProjectRepository.project(id);
  }
}
