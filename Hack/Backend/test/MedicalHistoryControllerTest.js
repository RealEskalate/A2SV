process.env.NODE_ENV = 'test';
var chai = require('chai');
var { MedicalHistory } = require('../models/MedicalHistory');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);

describe('Medical History test', function () {

    this.timeout(30000);
    beforeEach(function (done) {

        // MedicalHistory.collection.drop();
        var newMedicalHistory = new MedicalHistory({
            name: 'HyperTens.',
            description: 'High blood pressure'
        });
        newMedicalHistory.save(function (err) {
            // console.log("added " + newMedicalHistory);
            done();
        });
    });

    afterEach(function (done) {
        // this.timeout(30000);
        MedicalHistory.collection.drop();
        done();
    });


    it('should list all medical histories on /api/medicalhistory GET', function (done) {
        chai.request(server)
            .get('/api/medicalhistory')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('description');
                res.body[0].name.should.equal('HyperTens.');
                done();
            });
    });

    it('should add a medical history on /medicalhistory POST', function (done) {
        chai.request(server)
            .post('/api/medicalhistory')
            .send({ 'name': 'Pneumonia', 'description': 'inflammatory condition of lung' })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('description');
                res.body.should.have.property('_id');
                res.body.name.should.equal('Pneumonia');
                done();
            });
    });

    it('should list a single medical history by id on /medicalhistory/:id GET', function (done) {
        var mh = new MedicalHistory({
            name: "Kidney failure",
            description: " Failure of the kidney"
        });
        mh.save(function (err, data) {
            chai.request(server)
                .get('/api/medicalhistory/' + data._id)
                .end(function (err, response) {
                    response.should.have.status(200);
                    response.should.be.json;
                    response.body.should.be.a('object');
                    response.body.should.have.property('_id');
                    response.body.should.have.property('name');
                    response.body.should.have.property('description');
                    response.body.name.should.equal('Kidney failure');
                    done();
                });
        });

    });

    it('should list a single medical history by name on /medicalhistory/name/:name GET', function (done) {
        var mh = new MedicalHistory({
            name: "Kidney Failure",
            description: "Failure of the kidney"
        });

        mh.save(function (err, data) {
            chai.request(server)
                .get('/api/medicalhistory/name/' + data.name)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('description');
                    res.body.name.should.equal(data.name);
                    done();
                })
        });
    });

    it('should update a single medical history on api/medicalhistory/ PATCH', function (done) {
        var mh = new MedicalHistory({
            name: "Kidney Failure",
            description: "Failure of the kidney"
        });

        mh.save(function (err, data) {
            chai.request(server)
                .patch('/api/medicalhistory/' + data._id)
                .send({ 'name': 'FAILURE OF THE KIDNEY' })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('description');
                    res.body.name.should.equal('FAILURE OF THE KIDNEY');
                    done();
                })
        });
    });

    it('should delete a single medical history on api/medicalhistory/ DELETE', function (done) {
        var mh = new MedicalHistory({
            name: "Kidney Failure",
            description: "Failure of the kidney"
        });

        mh.save(function (err, data) {
            chai.request(server)
                .delete('/api/medicalhistory/')
                .send({ '_id': data._id })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('description');
                    done();
                })
        });
    });

});

