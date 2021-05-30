var mongoose = require("mongoose");

const cartListSchema = mongoose.Schema({
    tag: Number,
    name: String,
    image_url: String,
  });

var cartListModel = mongoose.model('cartlist', cartListSchema)

module.exports = cartListModel