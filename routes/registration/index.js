module.exports = function(params) {
  var app = params.app;
  const registerSevices = require("./track.service");
  var moment = require("moment");
  const _ = require("lodash");
  var axios = require('axios');
  var encodeUrl = require('encodeurl')
  
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
        let register=await registerSevices.register(req.body)
    } catch (err) {
      var errorCode = 402;
      app.http.customResponse(res, err, errorCode);
    }
  });
};
