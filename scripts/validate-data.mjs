import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(process.cwd(), 'src/data');
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const fail = (message) => {
  throw new Error(message);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};
const uniqueIds = (items, label) => {
  const ids = items.map((item) => item.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert(duplicates.length === 0, `${label}: duplicate IDs: ${[...new Set(duplicates)].join(', ')}`);
  return new Set(ids);
};
const assertRefs = (values, validIds, label) => {
  const missing = [...new Set(values)].filter((value) => !validIds.has(value));
  assert(missing.length === 0, `${label}: missing IDs: ${missing.join(', ')}`);
};
const assertUrl = (url, label) => {
  assert(typeof url === 'string' && /^https:\/\//.test(url), `${label}: expected HTTPS URL, got ${url}`);
  new URL(url);
};

const roadmap = read('roadmap.json');
const daily = read('daily-schedule.json');
const resources = read('resources.json').resources;
const projects = read('projects.json').projects;
const competitions = read('competitions.json').competitions;
const papers = read('papers.json').papers;
const leetcode = read('leetcode-problems.json').problems;

const resourceIds = uniqueIds(resources, 'resources');
const projectIds = uniqueIds(projects, 'projects');
const competitionIds = uniqueIds(competitions, 'competitions');
const paperIds = uniqueIds(papers, 'papers');
const leetcodeIds = uniqueIds(leetcode, 'leetcode');

assert(roadmap.weeks === 32, `roadmap.weeks must be 32, got ${roadmap.weeks}`);
assert(daily.weeks.length === 32, `daily schedule must contain 32 weeks, got ${daily.weeks.length}`);
assert(roadmap.weeklySchedule.length === 32, `roadmap summary must contain 32 weeks, got ${roadmap.weeklySchedule.length}`);
assert(JSON.stringify(daily.weeks.map((week) => week.week)) === JSON.stringify(Array.from({ length: 32 }, (_, index) => index + 1)), 'daily weeks must be sequential 1..32');

const taskIds = [];
for (const week of daily.weeks) {
  assert(week.days.length === 7, `week ${week.week}: expected 7 days, got ${week.days.length}`);
  assert(JSON.stringify(week.days.map((day) => day.day)) === JSON.stringify([1, 2, 3, 4, 5, 6, 7]), `week ${week.week}: days must be sequential 1..7`);
  const dayHours = week.days.reduce((sum, day) => sum + day.hours, 0);
  assert(Math.abs(dayHours - week.totalHours) < 1e-9, `week ${week.week}: totalHours ${week.totalHours} != day sum ${dayHours}`);
  assert(typeof week.deliverable === 'string' && week.deliverable.length > 10, `week ${week.week}: missing deliverable`);
  assert(Array.isArray(week.acceptanceCriteria) && week.acceptanceCriteria.length >= 3, `week ${week.week}: missing acceptance criteria`);
  assert(Array.isArray(week.tracks) && week.tracks.length > 0, `week ${week.week}: missing tracks`);
  assertRefs(week.resourceIds, resourceIds, `week ${week.week} resources`);
  assertRefs(week.projectIds, projectIds, `week ${week.week} projects`);
  assertRefs(week.paperIds, paperIds, `week ${week.week} papers`);
  assertRefs(week.competitionIds, competitionIds, `week ${week.week} competitions`);
  assertRefs(week.leetcodeIds, leetcodeIds, `week ${week.week} LeetCode`);
  for (const day of week.days) {
    assert(day.tasks.length > 0, `week ${week.week} day ${day.day}: no tasks`);
    for (const task of day.tasks) {
      taskIds.push(task.id);
      if (task.url) assertUrl(task.url, `task ${task.id}`);
    }
  }

  const summary = roadmap.weeklySchedule.find((item) => item.week === week.week);
  assert(summary, `week ${week.week}: missing roadmap summary`);
  assert(summary.focus === week.title, `week ${week.week}: summary focus does not match detailed title`);
  assert(Math.abs(summary.hours - week.totalHours) < 1e-9, `week ${week.week}: summary hours do not match detailed hours`);
  for (const key of ['resourceIds', 'projectIds', 'paperIds', 'competitionIds', 'leetcodeIds']) {
    assert(JSON.stringify(summary[key]) === JSON.stringify(week[key]), `week ${week.week}: summary ${key} drifted from detailed schedule`);
  }
}
const duplicateTasks = taskIds.filter((id, index) => taskIds.indexOf(id) !== index);
assert(duplicateTasks.length === 0, `daily tasks: duplicate IDs: ${[...new Set(duplicateTasks)].join(', ')}`);

for (const milestone of roadmap.milestones) {
  assertRefs(milestone.resources, resourceIds, `milestone week ${milestone.week} resources`);
  assertRefs(milestone.projects, projectIds, `milestone week ${milestone.week} projects`);
  assertRefs(milestone.competitions, competitionIds, `milestone week ${milestone.week} competitions`);
}

const validRoles = new Set(['core', 'supplemental', 'reference', 'specialization']);
for (const resource of resources) {
  assertUrl(resource.url, `resource ${resource.id}`);
  assert(validRoles.has(resource.curriculumRole), `resource ${resource.id}: invalid curriculumRole ${resource.curriculumRole}`);
  assert(Array.isArray(resource.scheduledWeeks), `resource ${resource.id}: missing scheduledWeeks`);
  for (const week of resource.scheduledWeeks) {
    assert(Number.isInteger(week) && week >= 1 && week <= 32, `resource ${resource.id}: invalid scheduled week ${week}`);
    const schedule = daily.weeks.find((item) => item.week === week);
    assert(schedule.resourceIds.includes(resource.id), `resource ${resource.id}: week ${week} is not back-referenced by schedule`);
  }
  if (resource.curriculumRole === 'core') {
    assert(resource.scheduledWeeks.length > 0, `core resource ${resource.id}: not scheduled`);
  }
  for (const [key, url] of Object.entries(resource.specificLinks ?? {})) {
    assertUrl(url, `resource ${resource.id} quick link ${key}`);
  }
}

const validProjectRoles = new Set(['flagship', 'supporting', 'specialization']);
for (const project of projects) {
  assert(validProjectRoles.has(project.portfolioRole), `project ${project.id}: invalid portfolioRole`);
  assertRefs(project.starterResources, resourceIds, `project ${project.id} starter resources`);
  assert(Array.isArray(project.scheduledWeeks), `project ${project.id}: missing scheduledWeeks`);
}
assert(projects.filter((project) => project.portfolioRole === 'flagship').length === 3, 'exactly three projects must be flagship');

for (const competition of competitions) assertUrl(competition.url, `competition ${competition.id}`);
for (const paper of papers) {
  assertUrl(paper.url, `paper ${paper.id}`);
  assert(Array.isArray(paper.scheduledWeeks) && paper.scheduledWeeks.length > 0, `paper ${paper.id}: not scheduled`);
}
for (const problem of leetcode) {
  assert(Number.isInteger(problem.scheduledWeek) && problem.scheduledWeek >= 1 && problem.scheduledWeek <= 32, `LeetCode ${problem.id}: not scheduled`);
  const schedule = daily.weeks.find((week) => week.week === problem.scheduledWeek);
  assert(schedule.leetcodeIds.includes(problem.id), `LeetCode ${problem.id}: schedule back-reference missing`);
}

const summaryHours = roadmap.weeklySchedule.reduce((sum, week) => sum + week.hours, 0);
const detailedHours = daily.weeks.reduce((sum, week) => sum + week.totalHours, 0);
assert(Math.abs(summaryHours - detailedHours) < 1e-9, `roadmap total ${summaryHours} != daily total ${detailedHours}`);

console.log(JSON.stringify({
  status: 'ok',
  weeks: daily.weeks.length,
  days: daily.weeks.reduce((sum, week) => sum + week.days.length, 0),
  tasks: taskIds.length,
  hours: detailedHours,
  resources: resources.length,
  coreResources: resources.filter((resource) => resource.curriculumRole === 'core').length,
  projects: projects.length,
  flagshipProjects: projects.filter((project) => project.portfolioRole === 'flagship').length,
  scheduledPapers: papers.length,
  scheduledLeetcodeProblems: leetcode.length,
}, null, 2));
