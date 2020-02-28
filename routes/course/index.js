module.exports = function (params) {
    var app = params.app;
    const trackSevices = require("./course.service");

    app.post("/addcourse", async (req, res) => {
        "use strict";
        try {
            var addcourse = await trackSevices.addcourseexternal(req.body);
            if (addcourse != false) {
                req.body.polyglotresponse = addcourse
                var insert_details = await trackSevices.addcourse(req.body);
                if (insert_details != false) {
                    app.http.customResponse(res, { success: true, message: "Course Added Successfully",course_key : addcourse.course_key }, 200);
                }
                else {
                    app.http.customResponse(res, { success: false, message: "Error in Adding Course" }, 200);
                }
            }
            else{
                app.http.customResponse(res, { success: false, message: addcourse }, 200); 
            }
        } catch (err) {
            var errorCode = 402;
            app.http.customResponse(res, err, errorCode);
        }
    });

    app.post("/getcoursecontentfrompolyglot", async (req, res) => {
        "use strict";
        try {
            var getcoursecontentdata = await trackSevices.getcoursecontent(req.body);
            if(getcoursecontentdata == "please provide your course key for getting the course content"){
                app.http.customResponse(res, { success: false, message: getcoursecontentdata }, 200);
            }
            else if (getcoursecontentdata != false) {
                app.http.customResponse(res, { success: true, message: getcoursecontentdata }, 200);
            }
            else {
                app.http.customResponse(res, { success: false, message: "Error in adding course content" }, 200);
            }
        } catch (err) {
            var errorCode = 402;
            app.http.customResponse(res, err, errorCode);
        }
    });

    app.post("/addcoursecontent", async (req, res) => {
        "use strict";
        try {
            var addcoursecontentdata = await trackSevices.addcoursecontent(req.body);
            if (addcoursecontentdata != false) {
                app.http.customResponse(res, { success: true, message: addcoursecontentdata }, 200);
            }
            else {
                app.http.customResponse(res, { success: false, message: "Error in adding course content" }, 200);
            }
        } catch (err) {
            var errorCode = 402;
            app.http.customResponse(res, err, errorCode);
        }
    });

    app.get("/viewcourse", async (req, res) => {
        "use strict";
        try {
            var course_details = await trackSevices.viewcourse(req.query);
            if (course_details != false) {
                app.http.customResponse(res, { success: true, message: course_details }, 200);
            }
            else {
                app.http.customResponse(res, { success: false, message: "Error in getting Course Details" }, 200);
            }
        } catch (err) {
            var errorCode = 402;
            app.http.customResponse(res, err, errorCode);
        }
    });

    app.get("/viewcoursebyid", async (req, res) => {
        "use strict";
        try {
            var course_details = await trackSevices.viewcoursebyid(req.query);
            if (course_details != false) {
                app.http.customResponse(res, { success: true, message: course_details }, 200);
            }
            else {
                app.http.customResponse(res, { success: false, message: "Error in getting Course Details" }, 200);
            }
        } catch (err) {
            var errorCode = 402;
            app.http.customResponse(res, err, errorCode);
        }
    });

    app.post("/updatecourse", async (req, res) => {
        "use strict";
        try {
            var course_details = await trackSevices.updatecourse(req.body);
            if (course_details != false) {
                app.http.customResponse(res, { success: true, message: "Course updated successfully" }, 200);
            }
            else {
                app.http.customResponse(res, { success: false, message: "Error in updating Course Details" }, 200);
            }
        } catch (err) {
            var errorCode = 402;
            app.http.customResponse(res, err, errorCode);
        }
    });

    app.post("/enrollcourse", async (req, res) => {
        "use strict";
        try {
            var course_details = await trackSevices.enrollcourse(req.body);
            if(course_details == "course already enrolled"){
                app.http.customResponse(res, { success: false, message: course_details }, 200);
            }
            else if(course_details == "Either Course Id, customer Id or Creator Id is missing"){
                app.http.customResponse(res, { success: false, message: course_details }, 200);
            }
            else if (course_details != false) {
                app.http.customResponse(res, { success: true, message: "Course Enrolled successfully" }, 200);
            }
            else {
                app.http.customResponse(res, { success: false, message: "Error in Enrolling Course" }, 200);
            }
        } catch (err) {
            var errorCode = 402;
            app.http.customResponse(res, err, errorCode);
        }
    });
};
