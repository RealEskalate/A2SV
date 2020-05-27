const mongoose = require("mongoose");

const ethiopiaDataSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  region: {
    type: String,
    required: true,
    unique: true,
    enum: ['Ethiopia', 'Addis Ababa', 'Afar', 'Amhara', 'Benishangul Gumuz', 'Dire Dawa', 'Gambela', 'Harari', 'Oromia', 'SNNPR', 'Somali', 'Tigray'],
  },
  amharic_region: {
    type: String,
    required: true,
    unique: true,
    enum: ['ኢትዮጵያ', 'አዲስ አበባ', 'አፋር', 'አማራ', 'ቤንሻንጉል ጉሙዝ', 'ድሬ ዳዋ', 'ጋምቤላ', 'ሃረሪ', 'ኦሮምያ', 'ደቡብ ክልል', 'ሶማሊ', 'ትግራይ'],
  },
  phone_number: {
    type: String,
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  recovered: {
    type: Number,
    required: true,
    default: 0,
  },
  death: {
    type: Number,
    required: true,
    default: 0,
  },
  active: {
    type: Number,
    required: true,
    default: 0,
  }, 
}, {timestamps : true});

var EthiopiaDataModel = mongoose.model("EthiopiaData", ethiopiaDataSchema);
module.exports = EthiopiaDataModel;
