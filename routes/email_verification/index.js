module.exports = function (params) {
  var app = params.app;
  const trackSevices = require("./verification.service");
  var moment = require("moment");
  const _ = require("lodash");
  var axios = require('axios');
  var encodeUrl = require('encodeurl')

  app.post("/verifyemail", async (req, res) => {
    "use strict";
    try {
      var check_email_status = await trackSevices.checkemail(req.body);
      if (check_email_status == true) {
        var output_data = await trackSevices.verifyemail(req.body);
        if (output_data == true) {
          app.http.customResponse(res, { success: true, message: "Email Sent Successfully" }, 200);
        }
        else {
          app.http.customResponse(res, { success: false, message: output_data }, 200);
        }
      }
      else {
        app.http.customResponse(res, { success: false, message: check_email_status }, 200);
      }
    } catch (err) {
      var errorCode = 402;
      app.http.customResponse(res, err, errorCode);
    }
  });

  app.post("/updateuserstatus", async (req, res) => {
    "use strict";
    try {
      var check_email_status = await trackSevices.updateuser(req.body);
      if(check_email_status == true){
        app.http.customResponse(res, { success: true, message: "User Activated Successfully" }, 200);
      }
      else{
        app.http.customResponse(res, { success: false, message: check_email_status }, 200);
      }
    } catch (err) {
      var errorCode = 402;
      app.http.customResponse(res, err, errorCode);
    }
  });


  app.get("/getuserdetails", async (req, res) => {
    "use strict";
    try {
      var get_user_data = await trackSevices.getuserdetails(req.query);
      if (get_user_data != false) {
        app.http.customResponse(res, { success: true, message: get_user_data }, 200);
      }
      else {
        app.http.customResponse(res, { success: false, message: "Error while getting user details" }, 200);
      }
    } catch (err) {
      var errorCode = 402;
      app.http.customResponse(res, err, errorCode);
    }
  });
};
