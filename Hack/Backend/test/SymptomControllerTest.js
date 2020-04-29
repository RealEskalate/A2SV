process.env.NODE_ENV = 'test';
var chai = require('chai');
var { Symptom } = require('../models/Symptom');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();
chai.use(chaiHttp);

describe('Symptom test', function () {

    this.timeout(30000);
    beforeEach(function (done) {

        // MedicalHistory.collection.drop();
        var newSymptom = new Symptom({
            name: 'Fever',
            description: 'High body temperature',
            relevance: 'MEDIUM'
        });
        newSymptom.save(function (err) {
            // console.log("added " + newMedicalHistory);
            done();
        });
    });

    afterEach(function (done) {
        // this.timeout(30000);
        Symptom.collection.drop();
        done();
    });


    it('should list all symptoms on /api/symptom GET', function (done) {
        chai.request(server)
            .get('/api/symptoms')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('description');
                res.body[0].should.have.property('relevance');
                done();
            });
    });


    it('should add symptom on /symptoms POST', function (done) {
        chai.request(server)
            .post('/api/symptoms')
            .send({ 'name': 'Sore throat', 'description': 'Soareness of the throat', 'relevance': 'HIGH' })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('description');
                res.body.should.have.property('relevance');
                res.body.name.should.equal('Sore throat');
                done();
            });
    });

    it('should list a single symptom by id on /symptom/:id GET', function (done) {
        var newSymptom = new Symptom({
            name: "Sore throat",
            description: "Soreness of the throat",
            relevance: "LOW"
        });
        newSymptom.save(function (err, data) {
            chai.request(server)
                .get('/api/symptoms/' + data._id)
                .end(function (err, response) {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    response.body.should.have.property('_id');
                    response.body.should.have.property('name');
                    response.body.should.have.property('description');
                    response.body.name.should.equal('Sore throat');
                    done();
                });
        });

    });

    it('should update a single symptom on api/symptoms/ PATCH', function (done) {
        var newSymptom = new Symptom({
            name: "Sore throat",
            description: "Soreness of the throat",
            relevance: "LOW"
        });

        newSymptom.save(function (err, data) {
            chai.request(server)
                .patch('/api/symptoms/' + data._id)
                .send({ 'description': 'an abnormally soar throat' })
                .end(function (err, res) {
                    // console.log("result is " + (res));
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('description');
                    res.body.description.should.equal('an abnormally soar throat');
                    done();
                })
        });
    });


    it('should delete a single symptom on api/symptoms/ DELETE', function (done) {
        var newSymptom = new Symptom({
            name: "Sore throat",
            description: "Soreness of the throat",
            relevance: "LOW"
        });

        newSymptom.save(function (err, data) {
            chai.request(server)
                .delete('/api/symptoms/')
                .send({ '_id': data._id })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('relevance');
                    done();
                })
        });
    });

});