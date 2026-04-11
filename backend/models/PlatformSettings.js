const mongoose = require('mongoose');

const PlatformSettingsSchema = new mongoose.Schema({
    aiFeaturesEnabled: {
        type: Boolean,
        default: true
    },
    isMaintenanceMode: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('PlatformSettings', PlatformSettingsSchema);
