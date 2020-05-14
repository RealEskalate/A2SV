const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
    unique: true,
    index: true
    // index: {
    // unique: true,
    // dropDups: true,
    // },
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  gender: {
    type: String,
    enum: ["MALE", "FEMALE", "UNDISCLOSED"],
    default: "MALE",
    required: true,
  },
  age_group: {
    type: String,
    enum: ["0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", ">90"],
    default: "21-30",
    required: true,
  },
  current_country: {
    type: String,
    required: false
  }
});

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(3).max(50).required(),
    gender: Joi.string().valid("MALE", "FEMALE", "UNDISCLOSED"),
    age_group: Joi.string().valid("0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", ">90"),
  });
  return Joi.validate(user._doc, schema);
}

const User = mongoose.model("User", userSchema);
const DemoUser = mongoose.model("Demo User", userSchema);

exports.User = User;
exports.DemoUser = DemoUser;
exports.validateUser = validateUser;
