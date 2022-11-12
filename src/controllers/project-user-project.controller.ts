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
import {Project,ProjectUser} from '../models';
import {ProjectRepository} from '../repositories';
import { CProject } from './router';

export class ProjectUserProjectController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) { }

  @get(CProject.USER_PROJECTS_IN_PROJECT, {
    responses: {
      '200': {
        description: 'Array of Project has many UserProject',
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
    return this.projectRepository.userProjects(id).find(filter);
  }

  @post(CProject.USER_PROJECTS_IN_PROJECT, {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProjectUser)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Project.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProjectUser, {
            title: 'NewUserProjectInProject',
            exclude: ['id'],
            optional: ['projectId']
          }),
        },
      },
    }) userProject: Omit<ProjectUser, 'id'>,
  ): Promise<ProjectUser> {
    return this.projectRepository.userProjects(id).create(userProject);
  }

  @patch(CProject.USER_PROJECTS_IN_PROJECT, {
    responses: {
      '200': {
        description: 'Project.UserProject PATCH success count',
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
    return this.projectRepository.userProjects(id).patch(userProject, where);
  }

  @del(CProject.USER_PROJECTS_IN_PROJECT, {
    responses: {
      '200': {
        description: 'Project.UserProject DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ProjectUser)) where?: Where<ProjectUser>,
  ): Promise<Count> {
    return this.projectRepository.userProjects(id).delete(where);
  }
}
