const express = require('express');
const caseController = require('../controllers/caseController');
const authController = require('../controllers/authController');

const router = express.Router();

// Publicly accessible for logged in users
router.use(authController.protect);

router.get('/', caseController.getAllCases);
router.post('/', caseController.createCase);
router.get('/:id', caseController.getCase);
router.post('/:id/star', caseController.toggleStar);
router.post('/:id/comment', caseController.addComment);

module.exports = router;
