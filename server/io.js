const http = require('http');

const { Server } = require('socket.io');

let io;

const addConnectionSlot = (userData) => {
  io.emit('sendData', userData);
};

const updateGlobalPot = (lobbyData) => {
  io.emit('sendUpdatedPot', lobbyData);
};

const updateSlotDOM = (slotData) => {
  io.emit('sendSlotData', slotData);
};

const removeSlotDOM = (slotData) => {
  io.emit('removeSlot', slotData)
}


const socketSetup = (app) => {
  const server = http.createServer(app);
  io = new Server(server);
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('renderSlot', addConnectionSlot);

    socket.on('renderLobby', updateGlobalPot);

    socket.on('reRenderSlots', updateSlotDOM);

    socket.on('takeSlot', removeSlotDOM);
  });

  return server;
};

// We only export the one function from this file, just like in router.js
module.exports = socketSetup;
