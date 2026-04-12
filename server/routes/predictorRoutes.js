const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { checkAIAccess } = require('../middleware/aiCheckMiddleware');
const predictorController = require('../controllers/predictorController');

const router = express.Router();

router.post('/predict', protect, restrictTo('lawyer'), checkAIAccess, predictorController.predictOutcome);

module.exports = router;
