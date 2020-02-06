module.exports = function(params) {
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

   app.post("/api/registration", async (req, res) => {
    "use strict";
    try {
        var encrypted_password = pbkdf2.pbkdf2Sync(req.body, 'salt', 1, 32, 'sha512')

        let register=await registerSevices.register(req.body)
        app.http.customResponse(res, {success : true, message : "Email Sent Successfully",register}, 200);
    } catch (err) {
      var errorCode = 402;
      app.http.customResponse(res, err, errorCode);
    }
  });
};
