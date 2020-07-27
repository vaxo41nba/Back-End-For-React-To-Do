const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
});

let User = mongoose.model("User", userSchema);

exports.User = User;
