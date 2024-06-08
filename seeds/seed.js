const sequelize = require('../config/connection');
const { User, Project, Comment } = require('../models');

const userData = require('./userData.json');
const projectData = require('./projectData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const projects = [];
  for (const project of projectData) {
    const newProject = await Project.create({
      ...project,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
    projects.push(newProject);
  }
  const comments = [];
  for (const comment of commentData) {
    const newComment = await Comment.create({
      ...comment,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      project_id: projects[Math.floor(Math.random() * projects.length)].id,
    });
    comments.push(newComment);
  }

  process.exit(0);
};

seedDatabase();
