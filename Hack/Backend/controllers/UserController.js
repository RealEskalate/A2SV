var UserSchema = require("../models/UserModel.js");
var mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const config = require('config');
const User = UserSchema.User;

// Get All Users.
exports.get_all_users = async (req, res) => {
  const users = await User.find();
  try {
    res.send(users);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// Get User by ID.
exports.get_user_by_id = async (req, res) => {

  const user = await User.findById(req.params.id);
  try {
    res.send(user);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// Get User by Username and Password.
exports.get_user_by_credentials = async (req, res) => {
  let user = await User.findOne({
    username: { $eq: req.body.username },
  });
  try {
    if (!user || !Bcrypt.compareSync(req.body.password, user.password)) {
      res.status(404).send("Username and Password combination doesn't exist");
    } else {
      let country = '';
      try {
        const result = await axios.get('http://www.geoplugin.net/json.gp?ip=' + req.connection.remoteAddress.substring(2))
          .then(response => {
            if (response.data) {
              country = response.data.geoplugin_countryName
            }
          })
          .catch(error => {
            console.log(error.toString());
          });
        user.set({
          current_country: country
        });
        await user.save();
      }
      catch (err) {
        console.log(err);
      }

      // jwt authentication(signing in) is  done here ...
      jwt.sign({ user }, config.get('secretkey'), (err, token) => {
        res.json({
          user: user,
          token: token
        });
      })

    }
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// Post a User
exports.post_user = async (req, res) => {
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    username: req.body.username,
    password: req.body.password,
    gender: req.body.gender,
    age_group: req.body.age_group,
  });
  try {
    const check = await User.findOne({ username: user.username });
    if (check) {
      return res.status(500).send("Username and Password combination already exists");
    }
    if (user.password.length < 5) {
      res.status(500).send("Password Length Too Short");
    } else {
      user.password = Bcrypt.hashSync(user.password, 10);
      await user.save();
      res.send(user);
    }
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// Update User by ID.
exports.update_user = async (req, res) => {

  try {
    let exists = await User.findOne({ username: req.body.username });
    // Change user info by _id
    let change = await User.findOne({ _id: req.body._id })
    if (exists && exists._id != req.body._id) {
      return res.status(400).send("Username already exists ");
    }

    if (req.body.password) {
      if (req.body.password.length < 5) {
        return res.status(500).send("Password Length Too Short");
      }
      req.body.password = Bcrypt.hashSync(req.body.password, 10);
    }

    change.set(req.body);
    await change.save();
    res.send(change);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// Delete User by ID.
exports.delete_user = async (req, res) => {

  try {
    const user = await User.findByIdAndDelete(req.body._id);
    if (!user) {
      return res.status(404).send("No item found");
    }
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
