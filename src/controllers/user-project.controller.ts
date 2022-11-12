import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {ProjectUser} from '../models';
import {ProjectUserRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('jwt')

export class UserProjectController {
  constructor(
    @repository(ProjectUserRepository)
    public userProjectRepository : ProjectUserRepository,
  ) {}

  @post('/user-projects')
  @response(200, {
    description: 'UserProject model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProjectUser)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectUser, {
            title: 'NewUserProject',
            exclude: ['id'],
          }),
        },
      },
    })
    userProject: Omit<ProjectUser, 'id'>,
  ): Promise<ProjectUser> {
    return this.userProjectRepository.create(userProject);
  }

  @get('/user-projects/count')
  @response(200, {
    description: 'UserProject model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProjectUser) where?: Where<ProjectUser>,
  ): Promise<Count> {
    return this.userProjectRepository.count(where);
  }

  @get('/user-projects')
  @response(200, {
    description: 'Array of UserProject model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProjectUser, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProjectUser) filter?: Filter<ProjectUser>,
  ): Promise<ProjectUser[]> {
    return this.userProjectRepository.find(filter);
  }

  @patch('/user-projects')
  @response(200, {
    description: 'UserProject PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectUser, {partial: true}),
        },
      },
    })
    userProject: ProjectUser,
    @param.where(ProjectUser) where?: Where<ProjectUser>,
  ): Promise<Count> {
    return this.userProjectRepository.updateAll(userProject, where);
  }

  @get('/user-projects/{id}')
  @response(200, {
    description: 'UserProject model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProjectUser, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ProjectUser, {exclude: 'where'}) filter?: FilterExcludingWhere<ProjectUser>
  ): Promise<ProjectUser> {
    return this.userProjectRepository.findById(id, filter);
  }

  @patch('/user-projects/{id}')
  @response(204, {
    description: 'UserProject PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectUser, {partial: true}),
        },
      },
    })
    userProject: ProjectUser,
  ): Promise<void> {
    await this.userProjectRepository.updateById(id, userProject);
  }

  @put('/user-projects/{id}')
  @response(204, {
    description: 'UserProject PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userProject: ProjectUser,
  ): Promise<void> {
    await this.userProjectRepository.replaceById(id, userProject);
  }

  @del('/user-projects/{id}')
  @response(204, {
    description: 'UserProject DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userProjectRepository.deleteById(id);
  }
}
