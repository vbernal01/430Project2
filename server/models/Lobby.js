const mongoose = require('mongoose');

let LobbyModel = {};
const LobbySchema = new mongoose.Schema({

  globalPot: {
    type: Number,
    min: 0,
    require: true,
  },
});

LobbySchema.statics.setPot = async (chipValue) => {
  const lobby = await LobbyModel.find({});
  const newPotAmount = (parseInt(lobby[0].globalPot, 10) + parseInt(chipValue, 10));
  lobby[0].globalPot = newPotAmount;
  await lobby[0].save();

  return newPotAmount;
};

LobbySchema.statics.getLobby = async () => {
  const lobby = await LobbyModel.find({});
  return lobby;
};

LobbyModel = mongoose.model('Lobby', LobbySchema);
module.exports = LobbyModel;
