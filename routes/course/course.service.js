const invoke = require("../../lib/http/invoke");
const crypto = require('crypto');
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.MYSQL_DB);
const util = require('util');
const query = util.promisify(connection.query).bind(connection);
var pbkdf2 = require('pbkdf2')
const passwordHash = require('pbkdf2-password-hash')
const qs = require('querystring');

let addcourse = async request => {
    try {
        request.is_active = true
        var postdata = {
            url: process.env.DB_URL,
            client: "course",
            docType: 0,
            query: request
        };
        let coursedata = await invoke.makeHttpCall("post", "write", postdata);
        if (coursedata.data.iid != undefined) {
            return true
        }
        else {
            return false
        }
    } catch (err) {
        return { status: false };
    }
};

let viewcourse = async request => {
    try {
        if (request.user_id != undefined) {
            var postdata = {
                url: process.env.DB_URL,
                client: "course",
                docType: 1,
                query: { user_id: request.user_id, is_active: true }
            };
            let coursedata = await invoke.makeHttpCall("post", "read", postdata);
            if (coursedata.data.statusMessage != undefined) {
                return coursedata.data.statusMessage
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    } catch (err) {
        return { status: false };
    }
};

let viewcoursebyid = async request => {
    try {
        if (request.user_id != undefined) {
            var postdata = {
                url: process.env.DB_URL,
                client: "course",
                docType: 1,
                query: { user_id: request.user_id ,_id:request._id, is_active: true }
            };
            let coursedata = await invoke.makeHttpCall("post", "read", postdata);
            if (coursedata.data.statusMessage != undefined) {
                return coursedata.data.statusMessage
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    } catch (err) {
        return { status: false };
    }
};

let updatecourse = async request => {
    try {
        var postdata = {
            url: process.env.DB_URL,
            client: "course",
            docType: 0,
            query: request
        };
        let coursedata = await invoke.makeHttpCall("post", "userwrite", postdata);
        if (coursedata.data.errorMessage == null) {
            return true
        }
        else {
            return false
        }
    } catch (err) {
        return { status: false };
    }
};

let addcourseexternal = async request => {
    try {
        request.display_name = request.course_name
        var response = await invoke.makeHttpCallpolyglotCMS("post", "/course/", request);
        if(response.status == 200){
            return response.data
        }
        else{
            return false
        }
    } catch (err) {
        if(err.response.status == 403){
            return true
        }
        else{
            return err.response.data
        }
    }
};

let enrollcourse = async request => {
    try {
        if ((request.course_id == null || request.course_id == undefined) 
        || (request.customer_id == null || request.customer_id == undefined)
        || (request.creator_id == null || request.creator_id == undefined)) {
            return "Either Course Id, customer Id or Creator Id is missing"
        }
        else {
            var postdataa = {
                url: process.env.DB_URL,
                client: "enroll_course",
                docType: 0,
                query: { course_id: request.course_id, customer_id: request.customer_id }
            };
            let coursedataa = await invoke.makeHttpCall("post", "read", postdataa);
            if (coursedataa.data.statusMessage == undefined) {
                var postdata = {
                    url: process.env.DB_URL,
                    client: "enroll_course",
                    docType: 0,
                    query: request
                };
                let coursedata = await invoke.makeHttpCall("post", "write", postdata);
                if (coursedata.data.iid != undefined) {
                    return true
                }
                else {
                    return false
                }
            }
            else {
                return "course already enrolled"
            }
        }
    } catch (err) {
        return { status: false };
    }
};

module.exports = {
    addcourse,
    viewcourse,
    updatecourse,
    addcourseexternal,
    viewcoursebyid,
    enrollcourse
};
