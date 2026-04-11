const express = require('express');
const router = express.Router();
const { analyzeDocument } = require('../controllers/documentController');
const { generateStrategy } = require('../controllers/strategyController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { checkAIAccess } = require('../middleware/aiCheckMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/generate-strategy', protect, restrictTo('law_student', 'lawyer'), checkAIAccess, generateStrategy);

module.exports = router;
