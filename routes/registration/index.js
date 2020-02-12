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

  app.post("/lmsregistration", async (req, res) => {
    "use strict";
    try {
      var registration_response = await registerSevices.externalregistration(req.body)
      if(registration_response == true){
        app.http.customResponse(res, { success: true, message: "User registered successfully" }, 200);
      }
      else{
        app.http.customResponse(res, { success: false, message: registration_response }, 200);
      }
    } catch (err) {
      app.http.customResponse(res, { success: false, message: registration_response }, 200);
    }
  });
};
