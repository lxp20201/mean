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
        var encrypted_password = await registerSevices.hashPassword(req.body.password)
        req.body.password = encrypted_password
        req.body.is_superuser = 0
        req.body.is_staff = 0
        req.body.is_active = 0
        req.body.date_joined = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let register= await registerSevices.register(req.body)
        app.http.customResponse(res, {success : true, message : "User registered successfully",register}, 200);
    } catch (err) {
      console.log(err)
      var errorCode = 402;
      app.http.customResponse(res, err, errorCode);
    }
  });
};
