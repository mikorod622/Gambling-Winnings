const router = require('express').Router();
const { Project, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and comments and JOIN with user data
    const projectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const projects = projectData.map((project) => project.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      projects, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    if (!projectData) {
      res.status(404).json({ message: 'No project found with this id' });
      return;
    }

    const project = projectData.get({ plain: true });

    const commentData = await Comment.findAll({
      where: { project_id: req.params.id },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const comments = commentData.map((comment) => comment.get({ plain: true }));

    res.render('project', {
      ...project,
      comments,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/comment/:project_id/:id', async (req, res) => {
  try {
    const { project_id, id } = req.params;

    // Find the comment by both id and project_id
    const commentData = await Comment.findOne({
      where: {
        id: id,
        project_id: project_id,
      },
      include: [
        {
          model: Project,
        },
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // If no comment is found, return a 404 error
    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id and project_id' });
      return;
    }

    const comment = commentData.get({ plain: true });
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
