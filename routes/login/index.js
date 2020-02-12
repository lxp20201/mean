module.exports = function (params) {
    var app = params.app;
    const loginservice = require("./login.service");
    const trigger = require("../../lib/http/invoke");
  
    app.post("/login", async (req, res) => {
      "use strict";
      try {
        var check_email_status = await loginservice.checkemail(req.body);
        if(check_email_status.statusMessage.length != 0){
            let redata = await trigger.openedxCall("post","/user_api/v1/account/login_session/",req.body);
              if(redata.data == ""){
                app.http.customResponse(res, { success: true, message: "Login Successfully",token:redata.headers }, 200); 
              }
        }else{
            app.http.customResponse(res, { success: false, message: "Email or password is incorrect" }, 200);
        }
      } catch (err) {
        var errorCode = 402;
        if(err.response&&err.response.data){
          app.http.customResponse(res,{ success:false , error:err.response.data}, errorCode);
        }else{
          console.log(err)
          app.http.customResponse(res,err, errorCode);
        }
       
      }
    });  

  };
  