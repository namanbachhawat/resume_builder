const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const resumeRoutes = require('./routes/resume');
const aiRoutes = require('./routes/ai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Resume Builder API is running!' });
});

// Start server immediately (AI routes don't need MongoDB)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// MongoDB Connection (non-blocking — server keeps running even if DB fails)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resumebuilder';

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,  // Give Atlas more time to respond
    socketTimeoutMS: 45000,           // Socket timeout
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('⚠️  MongoDB connection failed:', err.message);
    console.error('   Full error:', err.code || err.codeName || '');
    console.log('   AI routes will still work. Resume save/load requires MongoDB.');
    console.log('   👉 If "bad auth", reset your password at MongoDB Atlas → Database Access');
  });

// Listen for connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
});
