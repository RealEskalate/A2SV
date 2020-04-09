const mongoose = require('mongoose');
const schema = mongoose.Schema;

const location_user = new schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    location_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    TTL: {
        type: Date,
        expires: 0
    }
});

/* TTL is the date when the document expires.
In order to avoid timezone issues where the device's timezone is
different from our servers, we accept TTL as seconds to live then 
convert it to a date object */
location_user.pre('save', function() {
    this.TTL = new Date(Date.now() + Number(this.TTL));
});

const LocationUserModel = mongoose.model("LocationUser", location_user);
module.exports = LocationUserModel;