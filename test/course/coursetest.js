const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');

describe('Course Test Cases', function () {
    it('add course api call', function (done) {
        var input = {
            "course_name": "Angular JavaScript",
            "course_description": "An Opensource platform for UI Development",
            "user_id": "5e4a55ef8d7a8e19fc65fd9e",
            "course_image": ["https://www.cintanatech.com/newwebsite/wp-content/uploads/2019/06/logo.png"],
            "course_docs": ["https://documenter.getpostman.com/view/3561265/SzKQxfpk?version=latest"],
            "course_video": ["https://www.youtube.com/watch?v=3zGH5lRwUfs"],
            "org": "cintana11",
            "number": "CS10111",
            "run": "2019_T1"
        }
        axios.post('http://localhost:3001/addcourse', input, function (error, response, body) {
            console.log(body);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal('"Course Added Successfully"');
            }
            else if (body.success == false) {
                expect(body.success).to.equal(false);
                expect(body.message).to.equal('"Error in Adding Course"');
            }
        });
        done();
    });

    it('view course api call', function (done) {
        var input = "5e4a55ef8d7a8e19fc65fd9e"
        axios.get('http://localhost:3001/viewcourse?user_id=' + input, function (error, response, body) {
            console.log(body);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body).to.lengthOf(1);
            }
            else if (body.success == false) {
                expect(body.success).to.equal(false);
                expect(body.message).to.equal('"Error in getting Course Details"');
            }
        });
        done();
    });

    it('view course by id api call', function (done) {
        var input = { user_id: "5e4a55ef8d7a8e19fc65fd9e", _id: "5e4d30c64913811384d8b441" }
        axios.get('http://localhost:3001/viewcoursebyid?user_id=' + input.user_id + '&_id=' + input._id, function (error, response, body) {
            console.log(body);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body).to.lengthOf(1);
            }
            else if (body.success == false) {
                expect(body.success).to.equal(false);
                expect(body.message).to.equal('"Error in getting Course Details"');
            }
        });
        done();
    });

    it('update course api call', function (done) {
        var input = {
            "_id": "5e4d30c64913811384d8b441",
            "course_name": "Angular JavaScript 1"
        }
        axios.post('http://localhost:3001/updatecourse', input, function (error, response, body) {
            console.log(body);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal('"Course updated successfully"');
            }
            else if (body.success == false) {
                expect(body.success).to.equal(false);
                expect(body.message).to.equal('"Error in updating Course Details"');
            }
        });
        done();
    });

    it('enroll course api call', function (done) {
        var input = {
            "course_id": "5e4d30c64913811384d8b44a",
            "creator_id": "5e4525f32f5ce1428cb046ab",
            "customer_id": "5e453b251310327d9af482aa"
        }
        axios.post('http://localhost:3001/enrollcourse', input, function (error, response, body) {
            console.log(body);
            if (body.success == true) {
                expect(body.success).to.equal(true);
                expect(body.message).to.equal('"Course Enrolled successfully"');
            }
            else if (body.success == false) {
                expect(body.success).to.equal(false);
                if (body.message == "course already enrolled") {
                    expect(body.message).to.equal('"course already enrolled"');
                }
                else if (body.message == "Either Course Id, customer Id or Creator Id is missing") {
                    expect(body.message).to.equal('"Either Course Id, customer Id or Creator Id is missing"');
                }
                else if (body.message == "Error in Enrolling Course") {
                    expect(body.message).to.equal('"Error in Enrolling Course"');
                }
            }
        });
        done();
    });
});