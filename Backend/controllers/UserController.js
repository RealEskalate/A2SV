var UserModels = require("../models/UserModel.js");
var mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = UserModels.User;
const nodemailer = require('nodemailer');

// Get All Users. - [DEPRECATED: The information is too sensitive to share with API consumers]
exports.get_all_users = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var User = UserModels.DemoUser;
  } else if (req.query.stress && req.query.stress === "true") {
    var User = UserModels.StressUser;
  } else {
    var User = UserModels.User;
  }
  const users = await User.find();
  try {
    res.send(users);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
// Get User by ID.
exports.get_user_by_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var User = UserModels.DemoUser;
  } else if (req.query.stress && req.query.stress === "true") {
    var User = UserModels.StressUser;
  } else {
    var User = UserModels.User;
  }
  if (req.params.id !== req.body.loggedInUser) {
    return res
      .status(403)
      .send(
        "User not authorized to access this endpoint with id: " + req.params.id
      );
  }
  const user = await User.findById(req.params.id);
  try {
    res.send(user);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
// Get User by Username and Password.
exports.get_user_by_credentials = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var User = UserModels.DemoUser;
  } else if (req.query.stress && req.query.stress === "true") {
    var User = UserModels.StressUser;
  } else {
    var User = UserModels.User;
  }
  let user = await User.findOne({
    username: { $eq: req.body.username },
  });
  try {
    // console.log(user.password + " " + req.body.password + " bool " + Bcrypt.compareSync(req.body.password, user.password))
    if (!user || !Bcrypt.compareSync(req.body.password, user.password)) {
      res.status(404).send("Username and Password combination doesn't exist");
    } else {
      let country = "";
      try {
        const result = await axios
          .get(
            "http://www.geoplugin.net/json.gp?ip=" +
              req.connection.remoteAddress.substring(2)
          )
          .then((response) => {
            if (response.data) {
              country = response.data.geoplugin_countryName;
            }
          })
          .catch((error) => {
            console.log(error.toString());
          });
        user.set({
          current_country: country,
        });
        await user.save();
      } catch (err) {
        console.log(err.toString());
      }
      // jwt authentication(signing in) is  done here ...
      jwt.sign({ user }, process.env.APP_SECRET_KEY, (err, token) => {
        res.json({
          user: user,
          token: token,
        });
      });
    }
  } catch (err) {
    res.status(500).send(err.toString());
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
    const check = await User.findOne({ username: user.username });
    if (check) {
      return res
        .status(500)
        .send("Username and Password combination already exists");
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
    let change = await User.findOne({ _id: req.body._id });
    if (exists && exists._id != req.body._id) {
      return res.status(400).send("Username already exists ");
    } else if (req.body._id !== req.body.loggedInUser) {
      return res
        .status(403)
        .send(
          "User not authorized to access this endpoint with id: " + req.body._id
        );
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
    // console.log("error is " + err);
    res.status(500).send(err.toString());
  }
};
// Delete User by ID.
exports.delete_user = async (req, res) => {
  try {
    if (req.body._id !== req.body.loggedInUser) {
      return res
        .status(403)
        .send(
          "User not authorized to access this endpoint with id: " + req.body._id
        );
    }
    const user = await User.findByIdAndDelete(req.body._id);
    if (!user) {
      return res.status(404).send("No item found");
    }
    res.status(201).send(user);
  } catch (err) {
    console.log(err.toString());

    res.status(500).send(err.toString());
  }
};

// invite users ...
// preparing email transporter

const sendEmail = (mailOptions, res) =>{

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.APP_EMAIL_ADDRESS,
      pass: process.env.APP_EMAIL_PASSWORD 
    }
  });


  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.send(error.toString());
    } else {
      res.status(201).send('link sent successfully.');
      console.log('Email sent: ' + info.response);
    }
  });

}



// send invitation link to user

exports.send_invitation_link = async (req, res) => {
  let email = req.body.email;
  try {
    const check = await User.findOne({ email: email });
    if (check) {
      return res
        .status(422)
        .send("The email already exists.");
    }
    else if (email==undefined){
      return res
        .status(422)
        .send("The email is required.");
    }

    let signed_email = jwt.sign({email},process.env.APP_SECRET_KEY,{expiresIn:'6h'})
    let invitationLink = `${process.env.APP_WEB_CREATE_ACC_LINK}${signed_email}`;

    const mailOptions = {
      from: process.env.APP_EMAIL_ADDRESS,
      to: email,
      subject: 'Create your account!',
      text: ` you can use this link to create your account.\n ${invitationLink}`
    };

    return sendEmail(mailOptions,res);

  } catch (err) {
    res.status(500).send(err.toString());
  }
};



// verify and create account.

exports.create_invited_user = async (req, res) => {
  let signature = req.body.signature
  let email =null;
  if (signature){

    jwt.verify(signature, process.env.APP_SECRET_KEY, (err, decodedEmail) => {
      if (err) {
        res.status(401).send("Incorrect signature");
      } else {
        email = decodedEmail.email
      }
    });

  }

  const user = new User({
    _id: mongoose.Types.ObjectId(),
    username: req.body.username,
    password: req.body.password,
    gender: req.body.gender,
    age_group: req.body.age_group,
    role: "ephi_user",
    email:email
  });
  
  try {
    const check = await User.findOne({ username: user.username });
    if (check) {
      return res
        .status(422)
        .send("The username already exists");
    }
    if (user.password.length < 5) {
      res.status(422).send("The password length must be above 5");
    } else {
      user.password = Bcrypt.hashSync(user.password, 10);
      await user.save();
      res.send(user);
    }
  } catch (err) {
    res.status(500).send(err.toString());
  }
  
};



// reset password.

exports.send_reset_link = async (req, res) => {
  let email = req.body.email;
  try {
    const check = await User.findOne({ email: email });
    if (!check) {
      return res
        .status(401)
        .send("The email address doesn't exist.");
    }
    else if (email==undefined){
      return res
        .status(422)
        .send("The email is required.");
    }

    let signed_email = jwt.sign({email},process.env.APP_SECRET_KEY,{expiresIn:'6h'})
    let invitationLink = `${process.env.APP_WEB_RESET_ACC_LINK}${signed_email}`;

    const mailOptions = {
      from: process.env.APP_EMAIL_ADDRESS,
      to: email,
      subject: 'Reset your password!',
      text: ` you can use this link to reset your password.\n ${invitationLink}`
    };

    return sendEmail(mailOptions,res);

  } catch (err) {
    res.status(500).send(err.toString());
  }
};



// verify and reset password.

exports.save_new_password= async (req, res) => {
  let signature = req.body.signature
  let email =null;
  if (signature){

    jwt.verify(signature, process.env.APP_SECRET_KEY, (err, decodedEmail) => {
      if (err) {
        res.status(401).send("Incorrect signature");
      } else {
        email = decodedEmail.email
      }
    });

  }

  const check = await User.findOne({ email: email });
  if (!check) {
    return res
      .status(401)
      .send("The email address doesn't exist.");
  }

  try {
    let user =check;

    if (!req.body.password || req.body.password.length < 5) {
        return res.status(422).send("Invalid password.");
    }
    
    let password = Bcrypt.hashSync(req.body.password, 10);

    user.password=password
    user.save()
    
    res.send(user)
  } catch (err) {
    res.send(err.toString());
  }
  
};