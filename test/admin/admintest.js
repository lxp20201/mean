const assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var axios = require('axios');

describe('Admin test cases', function () {
    it('admin user dashboard api call', function (done) {
        var input = {
            "is_staff": true
        }
        axios.post('http://localhost:3001/adminuserdashboard', input, function (error, response, body) {
            console.log(body);
            expect(body).to.notequal(false);
            expect(body).to.lengthOf(0);
        });
        done();
    });
});