const mongoose = require('mongoose');

let LobbyModel = {};
const LobbySchema = new mongoose.Schema({
 
  globalPot: {
    type: Number,
    min: 0,
    require: true,
  },
});

LobbyModel = mongoose.model('Lobby', LobbySchema);

module.exports = LobbyModel;
