module.exports = function (params) {
    var app = params.app;
    const loginservice = require("./login.service");
    const trigger = require("../../lib/http/invoke");
  
    app.post("/login", async (req, res) => {
      "use strict";
      try {
        var check_email_status = await loginservice.checkemail(req.body);
        if(check_email_status.statusMessage.length != 0){
            let redata = await trigger.makeHttpCallpolyglot("post","/user_api/v1/account/login_session/",req.body);
              console.log(redata);
        }
        console.log(check_email_status)
      } catch (err) {
        var errorCode = 402;
        app.http.customResponse(res, err, errorCode);
      }
    });  

  };
  