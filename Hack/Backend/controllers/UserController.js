var UserSchema = require("../models/UserModel.js");
var mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = UserSchema.User;

// Get All Users.
exports.get_all_users = async (req, res) => {
  jwt.verify(req.token, 'secretkey', (err,authData) =>{
    if (err){
        res.status(401).send("Incorrect authentication key");
    }
  });

  const users = await User.find({});
  try {
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
};
// Get User by ID.
exports.get_user_by_id = async (req, res) => {
  jwt.verify(req.token, 'secretkey', (err,authData) =>{
      if (err){
          res.status(401).send("Incorrect authentication key");
      }
  });

  const user = await User.findById(req.params.id);
  try {
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};
// Get User by Username and Password.
exports.get_user_by_credentials = async (req, res) => {
  const user = await User.findOne({
    username: { $eq: req.body.username },
  });
  try {
    if (!user || !Bcrypt.compareSync(req.body.password, user.password)) {
      res.status(404).send("Username and Password combination doesn't exist");
    } else {

      // jwt authentication(signing in) is  done here ...
      jwt.sign({user}, 'secretkey', (err, token)=>{
        res.json({
          user: user,
          token:token
        });
      })
      
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
// Post a Use
exports.post_user = async (req, res) => {
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    username: req.body.username,
    password: req.body.password,
    gender: req.body.gender,
    age_group: req.body.age_group,
  });
  try {
    if (user.password.length < 5) {
      res.status(500).send("Password Length Too Short");
    } else {
      user.password = Bcrypt.hashSync(user.password, 10);
      await user.save();
      res.send(user);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
// Update User by ID.
exports.update_user = async (req, res) => {
  jwt.verify(req.token, 'secretkey', (err,authData) =>{
    if (err){
        res.status(401).send("Incorrect authentication key");
    }
  });

  try {
    if (req.body.password) {
      req.body.password = Bcrypt.hashSync(req.body.password, 10);
    }
    await User.findByIdAndUpdate(req.body._id, req.body);
    const user = await User.save();
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};
// Delete User by ID.
exports.delete_user = async (req, res) => {
  jwt.verify(req.token, 'secretkey', (err,authData) =>{
    if (err){
        res.status(401).send("Incorrect authentication key");
    }
  });

  try {
    const user = await User.findByIdAndRemove(req.body._id);
    if (!user) {
      res.status(404).send("No item found");
    }
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};
