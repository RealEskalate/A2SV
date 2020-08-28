var UserModels = require("../models/UserModel.js");
var mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = UserModels.User;
const emailSender = require("../services/EmailSender");
const { LocationUser } = require("../models/LocationUserModel.js");
const { DistrictModel } = require("../models/DistrictModel.js");
const { SymptomLog } = require("../models/SymptomLogModel");
const { TestReport } = require("../models/TestReportModel.js");

// get all users
exports.get_all_users = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var User = UserModels.DemoUser;
  } else if (req.query.stress && req.query.stress === "true") {
    var User = UserModels.StressUser;
  } else {
    var User = UserModels.User;
  }

  let filter = {};

  if(req.query.username){
      filter.username = {$regex: req.query.username, $options: 'i'};
  }

  if(req.query.country){
      filter.current_country = req.query.country;
  }

  if(req.query.role_type){
    filter.role = req.query.role_type;
  }

  if(req.query.start_date){
    filter.created_at = {$gte : new Date(req.query.start_date)}
  }

  if(req.query.end_date){
    let date = new Date(req.query.end_date)
    date.setHours(23)

    if(filter.created_at!=undefined){
      Object.assign(filter.created_at, {$lte : date});
    }else{
      filter.created_at =  {$lte : date}
    }
  }

  if(req.query.district){
    let district = await DistrictModel.findOne({name: req.query.district});
    let locationUsers = await LocationUser.find({'location.district': district._id}).distinct("user_id");
    filter._id = {$in : locationUsers};
  }

  if(req.query.region){
    let districts = await DistrictModel.find({state : req.query.region}).distinct("_id");
    let locationUsers = await LocationUser.find({'location.district' : {$in : districts}}).distinct("user_id");
    filter._id = {$in : locationUsers};
  }

  let page = parseInt(req.query.page) || 1;
  let size = parseInt(req.query.size) || 15;

  const users = await User.find(
    filter,
    {},
    { skip: (page - 1) * size, limit: size * 1 }
  );

  let result = {
    data_count: await User.countDocuments(filter),
    page_size: size,
    current_page: page,
    data: users,
  };

  try {
    res.send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// get user detail info
exports.get_detail_info= async(req,res)=>{
  let userDetails ={}

  userDetails.symptomHistory = await SymptomLog.findOne({user_id : req.params.id})
    .populate("user_id").populate({
      path: "current_symptoms.symptoms",
      model: "Symptom"
    }).populate({
        path: "history.symptoms",
        model: "Symptom"
    });
  
  userDetails.testReports = await TestReport.find({user_id: req.params.id})
    .populate("user_id")
    .populate("healthcare_worker_id");
  try {
    res.send(userDetails);
  } catch (err) {
    res.status(500).send(err.toString());
  }

}

// Get high level stat
exports.get_role_stat= async (req,res) =>{
  let result= {}

  result.allUsers= await User.countDocuments({});

  let date = new Date();
  date.setDate(date.getDate()-7)
  result.thisWeekNewUsers = await User.countDocuments({ created_at: {$gte : date }});

  result.healthcareWorkers = await User.countDocuments({ role: 'healthcare_worker'});
  result.ephiUsers = await User.countDocuments({ role: 'ephi_user'});

  result.systemAdmins = await User.countDocuments({ role: 'sysadmin'});

  try {
    res.send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }

}


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
    change.username = req.body.username || change.username;
    change.password = req.body.password || change.password;
    change.gender = req.body.gender || change.gender;
    change.age_group = req.body.age_group || change.age_group;
    change.email = req.body.email || change.email;
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
    let creator_id=req.body.loggedInUser

    let signed_email = jwt.sign({email,creator_id},process.env.APP_SECRET_KEY,{expiresIn:'6h'})
    let invitationLink = `${process.env.APP_WEB_CREATE_ACC_LINK}${signed_email}`;

    const usersData=[{ email : email, activationLink: invitationLink }]
    try {
      await emailSender.sendActivationLink(req, usersData);
      return res.status(200).send('Invitation message sent successfully.');
    } catch (error) {
      return res.status(500).send('Unable to sent invitation link.');
    }
    
  } catch (err) {
    res.status(500).send(err.toString());
  }
};


// send  invitation links for multiple users

exports.send_multiple_invitation_link = async (req, res) => {
  let emails = req.body.emails;
  try {
    let existingEmails= await User.find({ email: { $in: emails }});
    
    existingEmails = existingEmails.map(user => user.email);
    if (existingEmails.length > 0) {
      return res
        .status(422)
        .send( { "error": "This emails already exist.", "emails" :existingEmails });
    }
    
    if (emails==undefined){
      return res
        .status(422)
        .send("The email list is required.");
    }

    let usersData = [];
    let creator_id=req.body.loggedInUser

    for(var index in emails){
      let email = emails[index]

      let signed_email = jwt.sign({email,creator_id},process.env.APP_SECRET_KEY,{expiresIn:'6h'})
      let invitationLink = `${process.env.APP_WEB_CREATE_ACC_LINK}${signed_email}`;

      usersData.push({
         email : email,
         activationLink: invitationLink
      })

    
    }
    
    try {
      await emailSender.sendActivationLink(req, usersData);
      return res.status(200).send('Invitation message sent to all users successfully.');
    } catch (error) {
      return res.status(500).send('Unable to sent invitation link to all users.');
    }
    
  } catch (err) {
    res.status(500).send(err.toString());
  }
};


// verify and create account.

exports.create_invited_user = async (req, res) => {
  let signature = req.body.signature
  let email =null;
  let creator_id =null;
  if (signature){

    jwt.verify(signature, process.env.APP_SECRET_KEY, (err, decodedEmail) => {
      if (err) {
        res.status(401).send("Incorrect signature");
      } else {
        email = decodedEmail.email
        creator_id = decodedEmail.creator_id
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
    created_by:creator_id,
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

    const usersData = {
      activationLink: invitationLink,
      email:email,
    };

    try {
      await emailSender.sendResetPassword(req, usersData);
      return res.status(200).send('Password reset link sent successfully.');
    } catch (error) {
      return res.status(500).send('Unable to password reset link.');
    }

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