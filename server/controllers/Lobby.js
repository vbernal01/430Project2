const models = require('../models');

const LobbyModel = require('../models/Lobby');

const { Lobby } = models;

const setInverse = (number) => {
  let sign = Math.sign(number);

  if(sign === 1){
    return -number;
  }
  else{
    return Math.abs(number);
  }
}

const setLobbyPot = async (req, res) => {
  let { chips } = req.body;
  let orgValue = parseInt(chips, 10);
  let inverseValue = setInverse(orgValue);
  chips = inverseValue;
  const newGlobalPot = await LobbyModel.setPot(chips);
  return res.json({ globalPot: newGlobalPot });
};

const getCurrentLobby = async (req, res) => {
  const lobby = await LobbyModel.getLobby();
  return res.json(lobby);
};

const makeLobby = async (req, res) => {
  try {
    const newLobby = new Lobby({ globalPot: 0 });
    await newLobby.save();
    return res.status(201).json({ globalPot: 0 });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Lobby Exists Already' });
    }
    return res.status(400).json({ error: 'An error has occured' });
  }
};

module.exports = {
  setLobbyPot,
  getCurrentLobby,
  makeLobby,
};
