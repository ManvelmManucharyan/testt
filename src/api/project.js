import { get, put } from '@/utils/fetch';

export async function getProjects(params) {
  const url = `/api/v1/hr/projects/`;
  return await get(url, { params });
}

export async function getProject(project_id) {
  const url = `/api/v1/hr/projects/${project_id}/`;
  return await get(url);
}

export async function getProjectOpexTotals(params) {
  const url = `/api/v1/finance/project-opex-totals/`;
  return await get(url, { params });
}

export async function updateProject(id, data) {
  const url = `/api/v1/hr/projects/${id}/`;
  return await put(url, data);
}
