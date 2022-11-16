const http = require('http');

const { Server } = require('socket.io');

let io;

const addConnectionSlot = (userData) => {
  io.emit('sendData', userData);
};

const socketSetup = (app) => {
  const server = http.createServer(app);
  io = new Server(server);
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('addSlot', addConnectionSlot);
  });

  return server;
};

// We only export the one function from this file, just like in router.js
module.exports = socketSetup;
