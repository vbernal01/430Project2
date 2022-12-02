const models = require('../models');

const SlotModel = require('../models/Slots');

const { Slots } = models;

const makeSlot = async (req, res) => {
  const slotData = {
    bindKey: req.body.id,
    username: req.body.username,
  };

  try {
    const newSlot = new Slots(slotData);
    await newSlot.save();
    return res.status(201).json(slotData);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'You have already created a slot' });
    }
    return res.status(400).json({ error: 'An error has occured' });
  }
};

const getSlots = async (req, res) => {
  SlotModel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured! ' });
    }
    return res.json({ slots: docs });
  });
};

module.exports = { makeSlot, getSlots };
