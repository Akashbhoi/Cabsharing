const mongoose = require('mongoose');

const TravelSchema = new mongoose.Schema({
  posted_by: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  Gen: {
    type: String,
    required: true
  },
  Noof: {
    type: Number,
    required: true
  },
  Departuredate: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  accept: [
    {
      type: String, ref: 'User'
    }
  ],
  pending: [
    {
      type: String, ref: 'User'
    }
  ],
  Driver_id :[
    {
      type: String, ref: 'Driver'
    }
 ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Travel = mongoose.model('Travel', TravelSchema);

module.exports = Travel;