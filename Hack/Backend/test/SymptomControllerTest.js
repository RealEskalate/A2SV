process.env.NODE_ENV = 'test';
var chai = require('chai');
var { Symptom } = require('../models/Symptom');
var { User } = require('../models/UserModel')
const jwt = require("jsonwebtoken");
const config = require("config");

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
const { expect } = chai;

let mongoose = require("mongoose");
chai.use(chaiHttp);

describe('Symptoms API', function () {

    let symptom;
    let new_symptom;
    let user;
    var tokens;
    beforeEach(async () => {

        user = new User({
            _id: mongoose.Types.ObjectId(),
            username: `${Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000}`,
            password:
                "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
            gender: "FEMALE",
            age_group: "21-30",
        });
        await user.save();

        try {
            jwt.sign({ user }, config.get("secretkey"), (err, token) => {
                tokens = token;
            });
        } catch (err) {
        }

        symptom = new Symptom({
            _id: mongoose.Types.ObjectId(),
            name: 'Fever',
            description: 'High body temperature',
            relevance: 'MEDIUM'
        });
        await symptom.save();
    });

    afterEach(async () => {
        await Symptom.findByIdAndDelete(symptom._id);
        await User.findByIdAndDelete(user._id);
    });


    it('should list all symptoms on /api/symptom GET', async () => {

        let response = await chai.request(server)
            .get('/api/symptoms')
            .set(
                "Authorization",
                "Bearer " + tokens
            );
        expect(response).to.have.status(200)
    });
    /* /api/symptoms POST is deprecated
    it('should add symptom on /symptoms POST', async () => {
        let response = await chai.request(server)
            .post('/api/symptoms')
            .set(
                "Authorization",
                "Bearer " + tokens
            )
            .send({ 'name': 'Sore throat', 'description': 'Soareness of the throat', 'relevance': 'HIGH' });
        expect(response).to.have.status(200)

    });
    */
    it('should list a single symptom by id on /symptom/:id GET', async () => {
        let response = await chai.request(server)
            .get('/api/symptoms/' + symptom._id)
            .set(
                "Authorization",
                "Bearer " + tokens
            );
        expect(response).to.have.status(200)
    });

    /* /api/symptoms PATCH is deprecated
    it('should update a single symptom on api/symptoms/ PATCH', async () => {
        let response = await chai.request(server)
            .patch('/api/symptoms/' + symptom._id)
            .set(
                "Authorization",
                "Bearer " + tokens
            )
            .send({ 'description': 'an abnormally soar throat' })
        expect(response).to.have.status(200)
    });
    */
   /* /api/symptoms DELETE is deprecated
    it('should delete a single symptom on api/symptoms/ DELETE', async () => {
        let response = await chai.request(server)
            .delete('/api/symptoms/')
            .set(
                "Authorization",
                "Bearer " + tokens
            )
            .send({ '_id': symptom._id })
        expect(response).to.have.status(200)
    });
    */
});