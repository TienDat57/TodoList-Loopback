import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {User,ProjectUser} from '../models';
import {UserRepository} from '../repositories';
import { CUser } from './router';

@authenticate('jwt')
export class UserUserProjectController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get(CUser.USER_PROJECTS_IN_USER, {
    responses: {
      '200': {
        description: 'Array of User has many UserProject',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProjectUser)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<ProjectUser>,
  ): Promise<ProjectUser[]> {
    return this.userRepository.userProjects(id).find(filter);
  }

  @post(CUser.USER_PROJECTS_IN_USER, {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProjectUser)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectUser, {
            title: 'NewUserProjectInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userProject: Omit<ProjectUser, 'id'>,
  ): Promise<ProjectUser> {
    return this.userRepository.userProjects(id).create(userProject);
  }

  @patch(CUser.USER_PROJECTS_IN_USER, {
    responses: {
      '200': {
        description: 'User.UserProject PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectUser, {partial: true}),
        },
      },
    })
    userProject: Partial<ProjectUser>,
    @param.query.object('where', getWhereSchemaFor(ProjectUser)) where?: Where<ProjectUser>,
  ): Promise<Count> {
    return this.userRepository.userProjects(id).patch(userProject, where);
  }

  @del(CUser.USER_PROJECTS_IN_USER, {
    responses: {
      '200': {
        description: 'User.UserProject DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ProjectUser)) where?: Where<ProjectUser>,
  ): Promise<Count> {
    return this.userRepository.userProjects(id).delete(where);
  }
}
