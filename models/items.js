const mongoose = require("mongoose");

let todoItemsSchema = new mongoose.Schema({
  value: String,
  checked: Boolean,
  user: String
});

let Item = mongoose.model("Item", todoItemsSchema);

exports.Item = Item;