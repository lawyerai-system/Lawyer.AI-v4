const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { checkAIAccess } = require('../middleware/aiCheckMiddleware');
const simulationController = require('../controllers/simulationController');

const router = express.Router();

router.post('/simulate', protect, restrictTo('lawyer'), checkAIAccess, simulationController.simulateJudicialProcess);

module.exports = router;
