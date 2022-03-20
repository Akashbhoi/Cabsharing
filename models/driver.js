const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    email: {
        type: String,
       },

    Numberplate: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    Available: {
        type: String,
        required: true
    },
    Booked: {
        type: String,
    },
    phone_no: {
        type: String,
       },
    accept: [
        {
          type: String, ref: 'Travel'
        }
      ],
      pending: [
        {
          type: String, ref: 'Travel'
        }
      ],   
    date: {
        type: Date,
        default: Date.now
    }
});

const Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;