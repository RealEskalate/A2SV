const mongoose = require('mongoose');
const schema = mongoose.Schema;

const location_user = new schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
    },
    TTL: {
        type: Date,
        required: true,
        expires: 0
    },
    probability: {
        type: Number,
        required: false
    }
});

const demo_location_user = new schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Demo User',
        required: true
    },
    location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
    },
    TTL: {
        type: Date,
        required: true,
        expires: 0
    },
    probability: {
        type: Number,
        required: false
    }
});

const stress_location_user = new schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stress User',
        required: true
    },
    location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
    },
    TTL: {
        type: Date,
        required: true,
        expires: 0
    },
    probability: {
        type: Number,
        required: false
    }
});
/* TTL is the date when the document expires.
In order to avoid timezone issues where the device's timezone is
different from our servers, we accept TTL as seconds to live then 
convert it to a date object */
location_user.pre('save', function() {
    this.TTL = new Date(Date.now() + Number(this.TTL));
});
demo_location_user.pre('save', function() {
    this.TTL = new Date(Date.now() + Number(this.TTL));
});
stress_location_user.pre('save', function() {
    this.TTL = new Date(Date.now() + Number(this.TTL));
});

const LocationUserModel = mongoose.model("LocationUser", location_user);
const DemoLocationUserModel = mongoose.model("Demo LocationUser", demo_location_user);
const StressLocationUserModel = mongoose.model("Stress LocationUser", stress_location_user);

module.exports = {
    LocationUser: LocationUserModel, 
    DemoLocationUser: DemoLocationUserModel,
    StressLocationUser: StressLocationUserModel
};
