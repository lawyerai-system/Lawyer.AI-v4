const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const connectDB = require('./config/db');
const corsOptions = require('./config/cors');
const apiRoutes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const checkMaintenanceMode = require('./middleware/maintenanceMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');
const { initSocket } = require('./socket');
const startCleanupJob = require('./scripts/cleanupJob');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Global Middleware
// Trust proxy if we're behind a reverse proxy (Heroku, AWS ELB, etc)
app.set('trust proxy', 1);

// Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: false, // allow images to load locally if requested cross-origin
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // Limit body payload to 10kb to prevent DOS

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
app.use(checkMaintenanceMode);

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

// API Routes
app.use('/api', apiLimiter, apiRoutes);

app.get("/api/chatbot", (req, res) => {
    res.json({ chatbotId: "67adae0c9e89a6ec0f140953", type: "default" });
});

// Maintenance & Cleanup
startCleanupJob();

// Error Handling
app.use(errorHandler);

// API 404 handler
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: 'API Route not found' });
});

// Frontend Catch-all
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Lawyer.AI Backend running on port ${PORT}`);
    const io = initSocket(server, corsOptions);
    app.set('io', io);
});

// Process Handlers
process.on('unhandledRejection', (err) => console.error('Unhandled Rejection:', err));
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});