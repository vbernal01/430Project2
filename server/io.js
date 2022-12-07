const http = require('http');

const { Server } = require('socket.io');

let io;

// This is the method that will emit back to the client to send the new slot data.
const addConnectionSlot = (slotData) => {
  io.emit('sendData', slotData);
};

// This is the socket in charge of sending the updated pot value
const updateGlobalPot = (lobbyData) => {
  io.emit('sendUpdatedPot', lobbyData);
};

// This is the socket to update the slot wager
const updateSlotDOM = (slotData) => {
  io.emit('sendSlotData', slotData);
};

// This is the socket used to update the users if someone leaves
const removeSlotDOM = (slotData) => {
  io.emit('removeSlot', slotData);
};

// This is in charge of setting up all the connections between this .js and the client
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
