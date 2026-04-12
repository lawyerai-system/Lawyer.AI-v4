const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', reportController.createReport);

module.exports = router;
