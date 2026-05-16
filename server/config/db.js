const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle initial index maintenance
        try {
            await mongoose.connection.db.collection('users').dropIndex('username_1');
            console.log('Maintained user indexes');
        } catch (err) {
            if (err.code !== 27) {
                console.error('Index maintenance warning:', err.message);
            }
        }

        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
