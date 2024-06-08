const User = require('./User');
const Project = require('./Project');
const Comment = require('./Comment');

User.hasMany(Project, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

// models/Project.js
Project.belongsTo(User, {
  foreignKey: 'user_id'
});

Project.hasMany(Comment, {
  foreignKey: 'project_id'
});

// models/Comment.js
Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Project, {
  foreignKey: 'project_id'
});

module.exports = { User, Project, Comment };
