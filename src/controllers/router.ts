const CAuthenticate = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  ME: '/me',
}

const CProject = {
  CREATE: '/projects',
  TASKS_OF_PROJECT: '/projects/{projectId}/tasks',
  USER_PROJECTS_IN_PROJECT: '/projects/{projectId}/user-projects',
  COUNT_PROJECTS: '/projects/count',
  PROJECTS_BY_ID: '/projects/{id}',
}

const CTask = {
  CREATE: '/tasks',
  COUNT_TASKS: '/tasks/count',
  TASKS_BY_ID: '/tasks/{taskId}',
  TASK_BELONGS_TO_PROJECT: '/tasks/{taskId}/project',
  TASK_BELONGS_TO_TASKS: '/tasks/{taskId}/task',
  TASK_BELONGS_TO_USER: '/tasks/{taskId}/user',
}

const CUser = {
  CREATE: '/users',
  COUNT_USERS: '/users/count',
  USERS_BY_ID: '/users/{id}',
  USER_PROJECTS_IN_USER: '/users/{userId}/user-projects',
  USER_TASKS_IN_USER: '/users/{userId}/tasks',
}

const CUserProject = {
  USER_PROJECTS: '/user-projects',
  COUNT_USER_PROJECTS: '/user-projects/count',
  USER_PROJECTS_BY_ID: '/user-projects/{id}',
  USER_PROJECT_BELONGS_TO_PROJECT: '/user-projects/{userProjectId}/project',
  USER_PROJECT_BELONGS_TO_USER: '/user-projects/{userProjectId}/user',
}

export {
  CAuthenticate,
  CProject,
  CTask,
  CUser,
  CUserProject,
}
