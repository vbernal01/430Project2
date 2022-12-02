const mongoose = require('mongoose');

let SlotModel = {};
const SlotSchema = new mongoose.Schema({

  bindKey: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },

  username: {
    type: String,
    require: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
});

SlotModel = mongoose.model('Slots', SlotSchema);

module.exports = SlotModel;
