const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public routes (Read only)
router.get('/', blogController.getAllPosts);
router.get('/:id', blogController.getPost);
router.get('/:id/related', blogController.getRelatedPosts);

// Protected routes
router.use(protect); // All routes below this are protected

// Restricted to Lawyers
router.post('/create-blog', restrictTo('lawyer'), blogController.createPost);
router.patch('/:id', restrictTo('lawyer'), blogController.updatePost);
router.delete('/:id', restrictTo('lawyer'), blogController.deletePost);

// Comments available for all roles
router.post('/:id/comments', blogController.addComment);

module.exports = router;
