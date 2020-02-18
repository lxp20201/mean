module.exports = function (params) {
  var app = params.app;
  const registerSevices = require("./track.service");
  var moment = require("moment");
  const _ = require("lodash");
  var axios = require('axios');
  var encodeUrl = require('encodeurl')
  var pbkdf2 = require('pbkdf2')

  app.post("/apicheck", async (req, res) => {
    "use strict";
    try {

    } catch (err) {
      var errorCode = 402;
      app.http.customResponse(res, err, errorCode);
    }
  });

  app.post("/passwordencrypt", async (req, res) => {
    "use strict";
    try{
    var password_response = await registerSevices.passwordencrypt(req.body);  
      app.http.customResponse(res, { success: true, message: "Password updated successfully"}, 200);
  } catch (err) {
    app.http.customResponse(res, { success: false, message: err }, 200);
  }
});

  app.post("/updatestatus", async (req, res) => {
    "use strict";
    try {
      var registration_response = await registerSevices.update_status(req.body)
      if(registration_response.status == true){
        app.http.customResponse(res, { success: true, message: "Account is activated", csrftoken : registration_response.csrftoken, user_detail : registration_response.user_detail }, 200);
      }
      else{
        app.http.customResponse(res, { success: false, message: registration_response }, 200);
      }
    } catch (err) {
      app.http.customResponse(res, { success: false, message: registration_response }, 200);
    }
  });

  app.post("/registration", async (req, res) => {
    "use strict";
    try {
      console.log(req.body);
      var registration_response = await registerSevices.externalregistration(req.body);
      if(registration_response.status == true){
        app.http.customResponse(res, { success: true, message: "User registered successfully", csrftoken : registration_response.csrftoken, user_detail : registration_response.user_detail }, 200);
      }
      else{
        app.http.customResponse(res, { success: false, message: registration_response }, 200);
      }
    } catch (err) {
      app.http.customResponse(res, { success: false, message: registration_response }, 200);
    }
  });
};
