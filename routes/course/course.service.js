const invoke = require("../../lib/http/invoke");
const crypto = require('crypto');
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.MYSQL_DB);
const util = require('util');
const query = util.promisify(connection.query).bind(connection);
var pbkdf2 = require('pbkdf2')
const passwordHash = require('pbkdf2-password-hash')
const qs = require('querystring');
var _ = require("underscore");

let addcourse = async request => {
    try {
        // request.course_content = JSON.parse(request.course_content);
        request.is_active = true
        var postdata = {
            url: process.env.COURSE_DB_URL,
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
                url: process.env.COURSE_DB_URL,
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
                url: process.env.COURSE_DB_URL,
                client: "course",
                docType: 1,
                query: { user_id: request.user_id, _id: request._id, is_active: true }
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
            url: process.env.COURSE_DB_URL,
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
        if (response.status == 200) {
            return response.data
        }
        else {
            return false
        }
    } catch (err) {
        if (err.response.status == 403) {
            return true
        }
        else {
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
                url: process.env.COURSE_DB_URL,
                client: "enroll_course",
                docType: 0,
                query: { course_id: request.course_id, customer_id: request.customer_id }
            };
            let coursedataa = await invoke.makeHttpCall("post", "read", postdataa);
            if (coursedataa.data.statusMessage == undefined) {
                var postdata = {
                    url: process.env.COURSE_DB_URL,
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

let getcoursecontent = async request => {
    try {
        if(request.course_key == null || request.course_key == undefined){
            return "please provide your course key for getting the course content"
        }
        var response = await invoke.makeHttpCallpolyglotCMS("get", "/course/" + request.course_key);
        if (response.data) {
            return response.data
        }
        else {
            return false
        }
    } catch (err) {
        return { status: false };
    }
};

let addcoursecontent = async request => {
    try {
        var polyglot_param = {
            parent_locator: request.courseid,
            "category": request.category,
            "display_name": request.section_name
        }
        var response = await invoke.makeHttpCallpolyglotCMS("post", "/xblock/", polyglot_param);
        if (response.data) {
            var postdataa = {
                url: process.env.COURSE_DB_URL,
                client: "course",
                docType: 1,
                query: [{ $match: { "polyglot_course_response.course_key": response.data.courseKey } }]
            };
            let coursedataa = await invoke.makeHttpCall("post", "aggregate", postdataa);
            if (coursedataa.data.statusMessage.length > 0) {
                var updated_course_content = coursedataa.data.statusMessage[0];
                if (request.category == "chapter") {
                    if (updated_course_content.polyglot_course_response.section == undefined) {
                        updated_course_content.polyglot_course_response.section = [];
                        updated_course_content.polyglot_course_response.section.push({ chapterid: response.data.locator, content: request });
                    }
                    else {
                        updated_course_content.polyglot_course_response.section.push({ chapterid: response.data.locator, content: request })
                    }
                }
                else if (request.category == "sequential") {
                    var findsectionid = _.find(updated_course_content.polyglot_course_response.section, { chapterid: request.courseid })
                    if (findsectionid != undefined) {
                        if (findsectionid.subsection == undefined) {
                            findsectionid.subsection = [];
                            findsectionid.subsection.push({ sequentialid: response.data.locator, content: request });
                        }
                        else {
                            findsectionid.subsection.push({ sequentialid: response.data.locator, content: request });
                        }
                    }
                }
                else if (request.category == "vertical") {
                    var findsectionid = _.find(updated_course_content.polyglot_course_response.section, { chapterid: request.chapterid })
                    if (findsectionid != undefined) {
                        var findsubsectionid = _.find(findsectionid.subsection, { sequentialid: request.courseid })
                        if (findsubsectionid.unit == undefined) {
                            findsubsectionid.unit = [];
                            findsubsectionid.unit.push({ verticalid: response.data.locator, content: request });
                        }
                        else {
                            findsubsectionid.unit.push({ verticalid: response.data.locator, content: request });
                        }
                    }
                }
                var postdata = {
                    url: process.env.COURSE_DB_URL,
                    client: "course",
                    docType: 0,
                    query: updated_course_content
                };
                let coursedata = await invoke.makeHttpCall("post", "userwrite", postdata);
                return response.data
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

let checkingfield = async request => {
    try {
        if(request.category == undefined){
            return "please enter your category for course content"
        }
        if(request.category == "vertical"){
            if(request.chapterid == undefined || request.courseid == undefined || request.section_name == undefined || request.category == undefined){
                return "missing mandatory keys 1.chapterid 2.courseid 3.section_name 4.category"
            }
            else{
                return true
            }
        }
        else if(request.category == "sequential" || request.category == "chapter"){
            if(request.courseid == undefined || request.section_name == undefined || request.category == undefined){
                return "missing mandatory keys 1.courseid 2.section_name 3.category"
            }
            else{
                return true
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
    enrollcourse,
    getcoursecontent,
    addcoursecontent,
    checkingfield
};
