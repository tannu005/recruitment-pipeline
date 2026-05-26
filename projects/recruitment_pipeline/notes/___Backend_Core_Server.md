### `server.js`
```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { ApolloServer, gql } = require('apollo-server-express');
const NodeCache = require('node-cache');

// Load environment variables
dotenv.config();

// Global Cache (In-Memory Redis Mock)
const appCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
global.appCache = appCache;

const logger = require('./utils/logger');
const { initializeDatabase, dbQuery } = require('./utils/database');
const { generateToken } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP Server
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

app.set('io', io); // Pass IO instance to routes

io.on('connection', (socket) => {
  logger.info(`Socket client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    logger.info(`Socket client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (in case recruiters want to download resumes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const jobsRouter = require('./routes/jobs');
const candidatesRouter = require('./routes/candidates');
const evaluationsRouter = require('./routes/evaluations');
const auditRouter = require('./routes/audit');
const notesRouter = require('./routes/notes');

app.use('/api/jobs', jobsRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api', evaluationsRouter);
app.use('/api/audit', auditRouter);
app.use('/api/notes', notesRouter);

// Auth register endpoint
app.

// ... (truncated for workspace view)
```