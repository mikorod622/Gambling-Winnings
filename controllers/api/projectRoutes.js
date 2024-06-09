const router = require('express').Router();
const { Project } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newProject);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const projectData = await Project.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!projectData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(projectData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update project by ID
router.post('/:id', withAuth, async (req, res) => {
  try {
    // Find the project by ID
    const project = await Project.findByPk(req.params.id);

    // If the project doesn't exist, return a 404 error
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Update the project details
    project.name = req.body.name;
    project.description = req.body.description;
    project.needed_funding = req.body.needed_funding;

    // Save the changes to the database
    await project.save();

    // Return a success response
    res.status(200).json({ message: 'Project updated successfully' });
  } catch (err) {
    // Return a 500 error if there's an internal server error
    res.status(500).json(err);
  }
});

module.exports = router;
