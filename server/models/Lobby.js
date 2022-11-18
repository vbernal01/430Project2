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

LobbySchema.statics.setPot = async (chipValue) => {

  let lobby = await LobbyModel.find({});
  let newPotAmount = (parseInt(lobby[0].globalPot) + parseInt(chipValue));
  lobby[0].globalPot = newPotAmount;
 
  return chipValue;
}

LobbySchema.statics.getLobby = async () =>{
  let lobby = await LobbyModel.find({});
  return lobby;
}
module.exports = LobbyModel;
