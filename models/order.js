const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  order_name: {
    type: String,
    required: true,
  },
  order_status: {
    type: String,
    required: true,
  },
  order_instructions: {
    type: String,
  },
  pizza_type: {
    type: Schema.Types.ObjectId,
    ref: 'Pizza',
  },
});

module.exports = mongoose.model('Order', orderSchema);
