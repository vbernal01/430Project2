const mongoose = require('mongoose');

let SlotModel = {};
const SlotSchema = new mongoose.Schema({
 
  bindKey: {
    type: String,
    min: 0,
    require: true,
  },
});

SlotModel = mongoose.model('Slots', SlotSchema);

module.exports = SlotModel;
