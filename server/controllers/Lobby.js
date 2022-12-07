const models = require('../models');

const LobbyModel = require('../models/Lobby');

const { Lobby } = models;

// This is a helper method to get the inverse sign of a number
// When doing the send/remove action when the game ends, we need to subtract chips
// from the lobby
// Since the number that we are calling is a positive value, we need to
// make it negative so we can remove that amount from the lobby pot
const setInverse = (number) => {
  const sign = Math.sign(number);

  if (sign === 1) {
    return -number;
  }

  return Math.abs(number);
};

// This is where we handle the adding and subtracting of pot values
const setLobbyPot = async (req, res) => {
  let { chips } = req.body;
  const orgValue = parseInt(chips, 10);
  const inverseValue = setInverse(orgValue);
  chips = inverseValue;
  const newGlobalPot = await LobbyModel.setPot(chips);
  return res.json({ globalPot: newGlobalPot });
};

// Helper method to get lobby
const getCurrentLobby = async (req, res) => {
  const lobby = await LobbyModel.getLobby();
  return res.json(lobby);
};

// This is in charge of making a new Lobby Model, which should only happen once
// in the server.
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
