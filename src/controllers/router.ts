const CAuthenticate = {
  LOGIN: '/login',
  REGISTER: '/register',
  ME: '/me',
}

const CProject = {
  PROJECTS: '/projects',
  TASKS_OF_PROJECT: '/projects/{id}/tasks',
  USER_PROJECTS_IN_PROJECT: '/projects/{id}/user-projects',
  COUNT_PROJECTS: '/projects/count',
  PROJECTS_BY_ID: '/projects/{id}',
}

const CTask = {
  TASKS: '/tasks',
  COUNT_TASKS: '/tasks/count',
  TASKS_BY_ID: '/tasks/{id}',
  TASK_BELONGS_TO_PROJECT: '/tasks/{id}/project',
  TASK_BELONGS_TO_TASKS: '/tasks/{id}/task',
  TASK_BELONGS_TO_USER: '/tasks/{id}/user',
}

const CUser = {
  CREATE: '/users',
  COUNT_USERS: '/users/count',
  USERS_BY_ID: '/users/{id}',
  USER_PROJECTS_IN_USER: '/users/{id}/user-projects',
  USER_TASKS_IN_USER: '/users/{id}/tasks',
}

const CUserProject = {
  USER_PROJECTS: '/user-projects',
  COUNT_USER_PROJECTS: '/user-projects/count',
  USER_PROJECTS_BY_ID: '/user-projects/{id}',
  USER_PROJECT_BELONGS_TO_PROJECT: '/user-projects/{id}/project',
  USER_PROJECT_BELONGS_TO_USER: '/user-projects/{id}/user',
}

export {
  CAuthenticate,
  CProject,
  CTask,
  CUser,
  CUserProject,
}
