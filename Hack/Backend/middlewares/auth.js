
// Bearer access_token key.

function verifyToken(req, res, next){

    const authHeader= req.headers['authorization'];

    if (typeof authHeader!=='undefined'){
        const bearer= authHeader.split(' ')[1];
        req.token= bearer;
        next();
    }else{
        res.status(403).send("Please send the api authentication key"); 
    }
}


exports.verifyToken=verifyToken;