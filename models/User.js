const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  avatar: String,
  password: { type: String, required: true } // hashed
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);