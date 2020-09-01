const jwt = require("jsonwebtoken");
var { User } = require("../models/UserModel.js");
const roles = require('../roles.js');
// Bearer access_token key.
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (typeof authHeader !== "undefined") {
    const bearer = authHeader.split(" ")[1];
    req.token = bearer;
    let id;
    jwt.verify(bearer, process.env.APP_SECRET_KEY, (err, authData) => {
      if (err) {
        console.log(
          "FOUND AN ERROR HERE  " + err.toString() + " for token " + bearer
        );
        res.status(401).send("Incorrect authorization token");
      } else {
        id = authData.user._id;
      }
    });
    let user = await User.findById({ _id: id });
    if (!user) {
      return res.status(401).send("User does not exist!");
    }
    req.body.loggedInUser = id;
    next();
  } else {
    res.status(403).send("Please send the api authentication key");
  }
};

exports.grant_access = function (action, resource) {
  return async (req, res, next) => {
    try {
      let user = await User.findById(req.body.loggedInUser);
      const permission = roles.can(user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).send("You don't have enough permission to perform this action");
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
