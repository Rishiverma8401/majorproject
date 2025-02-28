const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 5000;

// Create HTTP server and Socket.io instance
const server = http.createServer(app);
const io = socketIo(server);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Join a room based on user role
  socket.on('join', (userData) => {
    if (userData && userData.role) {
      socket.join(userData.role);
      console.log(`User joined ${userData.role} room`);
    }
  });
  
  // Listen for new donation event
  socket.on('newDonation', (donation) => {
    // Broadcast to admin room
    io.to('admin').emit('donationUpdate', donation);
  });
  
  // Listen for new request event
  socket.on('newRequest', (request) => {
    // Broadcast to admin room
    io.to('admin').emit('requestUpdate', request);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
