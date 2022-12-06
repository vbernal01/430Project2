const models = require('../models');

const SlotModel = require('../models/Slots');

const { Slots } = models;

const makeSlot = async (req, res) => {
  const slotData = {
    bindKey: req.body.id,
    username: req.body.username,
  };

  // console.log(slotData);
  try {
    // console.log('Session Username: '+ req.session.account.username);

    // If the current session mathces the slot we are trying to make:
    if (req.session.account.username === req.body.username) {
      // We check if it exists already
      const existingModel = await SlotModel.exists({ username: req.body.username }).exec();

      // If it does, we create a new slot and
      if (!existingModel) {
        const newSlot = new Slots(slotData);
        await newSlot.save();
        return res.status(201).json(slotData);
      }
    }
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      // return res.status(400).json({ error: 'You have already created a slot' });
      // return res.json({})
    }
    return res.status(400).json({ error: 'An error has occured' });
  }
};

const removeSlot = async (req, res) => {
  const sessionUsername = req.session.account.username;
  try {
    await SlotModel.findOneAndDelete({ username: sessionUsername }).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error has occured' });
  }
  return res.json({ username: req.session.account.username });
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

module.exports = { makeSlot, getSlots, removeSlot };
