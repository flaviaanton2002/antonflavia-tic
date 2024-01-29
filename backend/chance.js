const Chance = require("chance");
const { db } = require("../db/firebase.js");
const chance = new Chance();

const generateProjects = (nrProiecte) => {
  const projects = [];
  for (let i = 0; i < nrProiecte; i++) {
    const projectId = chance.guid();
    const project = {
      projectId: projectId,
      name: chance.company(),
      description: chance.sentence(),
      startDate: chance.date({ string: true, american: false }),
    };
    projects.push(project);
  }
  return projects;
};

const generateTeamMembers = (nrMembrii, projects) => {
  const teamMembers = [];
  for (let i = 0; i < nrMembrii; i++) {
    const project = chance.pickone(projects);
    const membru = {
      name: `${chance.first()} ${chance.last()}`,
      function: chance.word(),
      email: chance.email(),
      projectId: project.projectId,
      projectName: project.name,
      projectDescription: project.description,
      projectStartDate: project.startDate,
    };
    teamMembers.push(membru);
  }
  return teamMembers;
};

const generateUsers = (nrUtilizatori) => {
  const users = [];
  for (let i = 0; i < nrUtilizatori; i++) {
    const user = {
      email: chance.email(),
      password: "parolaSecreta",
    };
    users.push(user);
  }
  return users;
};

const addData = async () => {
  const nrProiecte = 5;
  const nrMembrii = 20;
  const nrUtilizatori = 5;

  const projects = generateProjects(nrProiecte);
  const teamMembers = generateTeamMembers(nrMembrii, projects);
  const users = generateUsers(nrUtilizatori);

  const projectsCollectionRef = db.collection("projects");
  projects.forEach(async (project) => {
    const projectDocRef = projectsCollectionRef.doc(project.projectId);
    await projectDocRef.set(project);
  });

  const teamMembersCollectionRef = db.collection("team");
  teamMembers.forEach(async (teamMember) => {
    const teamMemberDocRef = teamMembersCollectionRef.doc();
    await teamMemberDocRef.set(teamMember);
  });

  const usersCollectionRef = db.collection("users");
  users.forEach(async (user) => {
    const userDocRef = usersCollectionRef.doc();
    await userDocRef.set(user);
  });

  console.log("Data added successfully.");
};

addData();
