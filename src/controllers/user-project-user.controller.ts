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
  User,
} from '../models';
import {ProjectUserRepository} from '../repositories';

@authenticate('jwt')
export class UserProjectUserController {
  constructor(
    @repository(ProjectUserRepository)
    public userProjectRepository: ProjectUserRepository,
  ) { }

  @get('/user-projects/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to UserProject',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof ProjectUser.prototype.id,
  ): Promise<User> {
    return this.userProjectRepository.user(id);
  }
}
