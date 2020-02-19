module.exports = function (params) {
  var app = params.app;
  const loginservice = require("./login.service");
  const trigger = require("../../lib/http/invoke");

  app.post("/login", async (req, res) => {
    "use strict";
    try {
      var check_email_status = await loginservice.checkemail(req.body);
      if (check_email_status.statusMessage.length != 0) {
        let redata = await trigger.openedxCall("post", "/user_api/v1/account/login_session/", req.body);
        if (redata.data == "") {
          app.http.customResponse(res, { success: true, message: "Login Successfully", token: redata.headers }, 200);
        }
      } else {
        app.http.customResponse(res, { success: false, message: "Email or password is incorrect" }, 200);
      }
    } catch (err) {
      var errorCode = 402;
      if (err.response && err.response.data) {
        var error_response = err.response.data
        app.http.customResponse(res, { success: false, error: error_response.replace(/<[^>]*>/g, '') }, errorCode);
      } else {
        console.log(err)
        app.http.customResponse(res, err, errorCode);
      }

    }
  });

  app.post("/forgotpassword", async (req, res) => {
    "use strict";
    try {
      var insert_mailid = await loginservice.insertmailtofp(req.body);
      if (insert_mailid == true) {
        var check_email_status = await loginservice.sendforgotpasswordmail(req.body);
        if (check_email_status == true) {
          app.http.customResponse(res, { success: true, message: "A Mail has been sent Successfully to reset your password" }, 200);
        } else {
          app.http.customResponse(res, { success: false, message: check_email_status }, 200);
        }
      }
      else {
        app.http.customResponse(res, { success: false, message: "Error in triggering mail" }, 200);
      }
    } catch (err) {
      var errorCode = 402;
      if (err.response && err.response.data) {
        app.http.customResponse(res, { success: false, error: err.response.data }, errorCode);
      } else {
        console.log(err)
        app.http.customResponse(res, err, errorCode);
      }
    }
  });
};
