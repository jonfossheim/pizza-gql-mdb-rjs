const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pizzaSchema = new Schema({
  pizza_name: {
    type: String,
    required: true,
  },
  pizza_price: {
    type: Number,
    required: true,
  },
  pizza_image: {
    type: String,
  },
  stock: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Pizza', pizzaSchema);
