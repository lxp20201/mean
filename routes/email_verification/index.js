module.exports = function(params) {
  var app = params.app;
  const trackSevices = require("./verification.service");
  var moment = require("moment");
  const _ = require("lodash");
  var axios = require('axios');
  var encodeUrl = require('encodeurl')
  
  app.post("/verifyemail", async (req, res) => {
    "use strict";
    try {
      var output_data = await trackSevices.verifyemail(req.body);
      if(output_data == true){
        app.http.customResponse(res, {success : true, message : "Email Sent Successfully"}, 200);
      }
      else{
        app.http.customResponse(res, {success : false, message : output_data}, 200);
      }
    } catch (err) {
      var errorCode = 402;
      app.http.customResponse(res, err, errorCode);
    }
  });
};
