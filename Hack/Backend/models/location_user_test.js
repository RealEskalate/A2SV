const mongoose = require("mongoose");
const location_user = require("./LocationUserModel");
const conn_string = "mongodb+srv://dbAdmin:EOW2tr3cqUcPqp7k@symtrack-zokm9.gcp.mongodb.net/test?retryWrites=true&w=majority"

/* Tests if the model works along with
the pre save hook and the automatic expire
successful if at 20 sec mark (more or less)
it deletes the document.
TEST PASSED ON LOCAL MACHINE AT COMMIT */
mongoose.connect(conn_string, {useNewUrlParser: true, useUnifiedTopology: true, dbName: "hackathon"});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("YAYYYYYYY");
});

let test = new location_user({
    user_id: mongoose.Types.ObjectId(),
    location_id: mongoose.Types.ObjectId(),
    TTL: 20
});

test.save(err => console.log(err));

setInterval(async function(){
    const result = await location_user.find();
    console.log(result);
}, 5000)