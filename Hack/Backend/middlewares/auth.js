const jwt = require("jsonwebtoken");
const config = require("config");
var { User } = require("../models/UserModel.js");
// Bearer access_token key.
exports.verifyToken = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    console.log("AUTHORIZING");
    if (typeof authHeader !== 'undefined') {
        const bearer = authHeader.split(' ')[1];
        req.token = bearer;
        let id;
        jwt.verify(bearer, config.get('secretkey'), (err, authData) => {
            if (err) {
                // console.log("FOUND AN ERROR HERE \n\n");
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
        console.log("passing to next");
        next();
    } else {
        res.status(403).send("Please send the api authentication key");
    }
}
