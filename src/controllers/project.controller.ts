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
import {Project} from '../models';
import {ProjectRepository, ProjectUserRepository} from '../repositories';
import {SecurityBindings, securityId} from '@loopback/security';
import {MyUserProfile} from '../services/Credentials';
import {inject} from '@loopback/core';
import set from 'lodash/set';
import {authenticate} from '@loopback/authentication';
import { CProject } from './router';
import { EUserRole } from '../enums';

@authenticate('jwt')
export class ProjectController {
  constructor(
    @repository(ProjectRepository)
    public projectRepository : ProjectRepository,

    @repository(ProjectUserRepository)
    public projectUserRepository : ProjectUserRepository,
  ) {}

  @post(CProject.PROJECTS)
  @response(200, {
    description: 'Project model instance',
    content: {'application/json': {schema: getModelSchemaRef(Project)}},
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: MyUserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {
            title: 'NewProject',
            exclude: ['id'],
          }),
        },
      },
    })
    project: Omit<Project, 'id'>,
  ): Promise<void> {
    const userId: string = currentUserProfile?.id;
    project.createdBy = userId;
    project.updatedBy = userId;
    const createdProject = await this.projectRepository.create(project)
    const projectId = createdProject.id;
    const projectUser  = {
      userId,
      projectId,
      role: EUserRole.ADMIN
    };
    await this.projectUserRepository.create(projectUser);
  }

  @get(CProject.COUNT_PROJECTS)
  @response(200, {
    description: 'Project model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Project) where?: Where<Project>,
  ): Promise<Count> {
    return this.projectRepository.count(where);
  }

  @get(CProject.PROJECTS)
  @response(200, {
    description: 'Array of Project model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Project, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Project) filter?: Filter<Project>,
  ): Promise<Project[]> {
    return this.projectRepository.find(filter);
  }

  @patch(CProject.PROJECTS)
  @response(200, {
    description: 'Project PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @inject(SecurityBindings.USER)
    currentUserProfile: MyUserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {partial: true}),
        },
      },
    })
    project: Project,
    @param.where(Project) where?: Where<Project>,
  ): Promise<Count> {
    const userId: string = currentUserProfile?.id;
    project.updatedBy = userId;
    set(project, 'updatedAt', new Date());
    return this.projectRepository.updateAll(project, where);
  }

  @get(CProject.PROJECTS_BY_ID)
  @response(200, {
    description: 'Project model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Project, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Project, {exclude: 'where'}) filter?: FilterExcludingWhere<Project>
  ): Promise<Project> {
    return this.projectRepository.findById(id, filter);
  }

  @patch(CProject.PROJECTS_BY_ID)
  @response(204, {
    description: 'Project PATCH success',
  })
  async updateById(
    @inject(SecurityBindings.USER)
    currentUserProfile: MyUserProfile,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {partial: true}),
        },
      },
    })
    project: Project,
  ): Promise<void> {
    const userId: string = currentUserProfile?.id;
    set(project, 'updatedBy', userId);
    set(project, 'updatedAt', new Date());
    await this.projectRepository.updateById(id, project);
  }

  @put(CProject.PROJECTS_BY_ID)
  @response(204, {
    description: 'Project PUT success',
  })
  async replaceById(
    @inject(SecurityBindings.USER)
    currentUserProfile: MyUserProfile,
    @param.path.string('id') id: string,
    @requestBody() project: Project,
  ): Promise<void> {
    const userId: string = currentUserProfile?.id;
    set(project, 'updatedBy', userId);
    set(project, 'updatedAt', new Date());
    await this.projectRepository.replaceById(id, project);
  }

  @del(CProject.PROJECTS_BY_ID)
  @response(204, {
    description: 'Project DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.projectRepository.deleteById(id);
  }
}
