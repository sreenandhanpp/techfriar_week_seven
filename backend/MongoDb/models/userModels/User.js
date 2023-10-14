//importing modules
const mongoose = require("mongoose");

//defining the structure of the collection
const newUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
  },
  phone: {
    type: String,
    required: false,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    country: {
      type: String,
      required: true,
      sparse: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  profile_image: {
    id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
});

//creating the model
const newUser = mongoose.model("user", newUserSchema);

module.exports = newUser;
