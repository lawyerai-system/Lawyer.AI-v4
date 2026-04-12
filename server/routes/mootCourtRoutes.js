const express = require('express');
const router = express.Router();
const { 
    startSession, 
    sendMessage, 
    endSession, 
    getUserHistory, 
    getSession, 
    analyzePerformance 
} = require('../controllers/mootCourtController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);
router.use(restrictTo('law_student', 'lawyer', 'admin'));

router.post('/start', startSession);
router.post('/message', sendMessage);
router.post('/end', endSession);
router.get('/history', getUserHistory);
router.get('/analysis', analyzePerformance);
router.get('/:id', getSession);

module.exports = router;
