const models = require('../models');

const LobbyModel = require('../models/Lobby');

const { Lobby } = models;


const setLobbyPot = async (req, res) => {

    let chips = req.body.chips;
    let globalPot = await LobbyModel.setPot(chips);

    return res.json({ newGlobalPot: globalPot });
}

const getCurrentLobby = async (req, res) => {
    let lobby = await LobbyModel.getLobby();

    return res.json(lobby);
}

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
}


module.exports = {
    setLobbyPot,
    getCurrentLobby,
    makeLobby
}
