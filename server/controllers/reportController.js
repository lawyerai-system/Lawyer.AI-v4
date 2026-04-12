const Report = require('../models/Report');

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
    try {
        const { reportType, targetId, targetName, reason, description } = req.body;

        if (!reportType || !targetId || !targetName || !reason) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide reportType, targetId, targetName, and reason.'
            });
        }

        const report = await Report.create({
            reporter: req.user.id,
            reportType,
            targetId,
            targetName,
            reason,
            description
        });

        res.status(201).json({
            status: 'success',
            data: { report }
        });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
