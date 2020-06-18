const jwt = require("jsonwebtoken");
var { User } = require("../models/UserModel.js");
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
        // console.log("auth is " + id);
      }
    });
    // console.log("going to check user");
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
