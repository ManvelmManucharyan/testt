export function offerLink(offerId, tab = 'general') {
  return this.$router.resolve({
    name: 'offers-page-detail',
    params: { offerId },
    query: { ...this.$route.query, tab },
  }).href;
}

export function opexLink(offerId, fromDate, toDate, tab = 'offer') {
  return this.$router.resolve({
    name: 'opex-page',
    query: {
      ...this.$route.query,
      tab,
      offer_id: offerId,
      from_date: fromDate,
      to_date: toDate,
    },
  }).href;
}

export function roleLink(offerId, roleId) {
  return this.$router.resolve({
    name: 'offers-page-detail',
    params: { offerId },
    query: { tab: 'rolesAndStages', edit_role: roleId },
  }).href;
}

export function projectLink(id, tab = 'general') {
  return this.$router.resolve({
    name: 'projects-page-detail',
    params: { projectId: id },
    query: { tab },
  }).href;
}

export function companyLink(id, tab = 'info') {
  return this.$router.resolve({
    name: 'companies-page-detail',
    params: { companyId: id },
    query: { tab },
  }).href;
}

export function stageLink(offerId, stageId, tab = 'rolesAndStages') {
  return this.$router.resolve({
    name: 'offers-page-detail',
    params: { offerId },
    query: { tab, edit_stage: stageId },
  }).href;
}

export function monthlyDataLink(
  employeeId,
  tab = 'finance',
  salary_type = 'net',
) {
  return this.$router.resolve({
    name: 'employees-page-detail',
    params: { employeeId },
    query: {
      tab,
      year: this.$route.query.year,
      salary_type,
    },
  }).href;
}

export function employeeRolesLink(
  employeeId,
  fromDate,
  toDate,
  project,
  tab = 'roles',
) {
  return this.$router.resolve({
    name: 'employees-page-detail',
    params: { employeeId },
    query: {
      from_date: fromDate,
      to_date: toDate,
      tab,
      project,
    },
  }).href;
}

export function trackedTimeLink(
  employeeIds,
  projectIds,
  fromDate,
  toDate,
  groupBy = 'project',
) {
  return this.$router.resolve({
    name: 'tracked-times-page',
    query: {
      group_by: groupBy,
      from_date: fromDate,
      to_date: toDate,
      project_ids: projectIds,
      employee_ids: employeeIds,
    },
  }).href;
}

export function employeeDetailLink(employeeId) {
  return this.$router.resolve({
    name: 'employees-page-detail',
    params: { employeeId },
    query: {
      tab: 'personalInfo',
    },
  }).href;
}
