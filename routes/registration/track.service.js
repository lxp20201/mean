const invoke = require("../../lib/http/invoke");
const crypto = require('crypto');
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.MYSQL_DB);
const util = require('util');
const query = util.promisify(connection.query).bind(connection);
const pbkdf2 = require('pbkdf2')
var randomstring = require("randomstring");
var moment = require("moment");

let putRecord = async orderdata => {
  return await OrderService.SaveOrder(orderdata);
};

//To get the order details.
let getOrderDetailFromOrder = async orderid => {
  try {
    var postdata = {
      url: process.env.DB_URL,
      client: "orders",
      docType: 0,
      query: { _id: orderid }
    };
    let orderdata = await invoke.makeHttpCall("post", "read", postdata);

    return orderdata.data.statusMessage;
  } catch (err) {
    return { status: false };
  }
};

let update_status = async (data) => {
  try {
    var user = data.username;
    const response = await query("UPDATE auth_user SET is_active = 1 WHERE username = '" + user + "'")
    request.is_active = true
      var postdata = {
        url: process.env.DB_URL,
        client: "auth_user",
        docType: 0,
        query: request
      };
      let responsedata = await invoke.makeHttpCall("post", "userwrite", postdata);
  } catch (error) {
    console.log(error)
    return false
  }
}

let externalregistration = async (request) => {
  try {
    var payload = request;
    var response = await invoke.makeHttpCallpolyglot("post", "/user_api/v1/account/registration/", payload);
    console.log(response.data);
    if (response.data.success == true) {
      request.is_active = false
      request.is_superuser = false
      var postdata = {
        url: process.env.DB_URL,
        client: "auth_user",
        docType: 0,
        query: request
      };
      let responsedata = await invoke.makeHttpCall("post", "write", postdata);
      request._id = responsedata.data.iid
      console.log(request._id);
      var cookie = response.headers['set-cookie'][0];
      var csrftoken = cookie.split(';');
      var result = {
        status: true,
        csrftoken: csrftoken[0].slice(10),
        user_detail: request
      }
      console.log(result);
      return result;
    }
    else {
      return response.data
    }
  } catch (error) {
    console.log(error);
    return error.response.data
  }
}

let passwordencrypt = async (data) => {
  try {
    var user = data.email;
    var password = data.password;

    var salt2 = randomstring.generate({
      length: 12,
      charset: 'alphabetic'
    });
    var iterations = 36000;
    const hashPassword = pbkdf2.pbkdf2Sync(password, salt2, iterations, 32, "sha256").toString("base64");  
    var final_password = 'pbkdf2_sha256$36000$'+salt2+'$'+hashPassword;
    var getdata = {
      url: process.env.DB_URL,
      client: "auth_user",
      docType: 1,
      query: { email: data.email}
    };
    let userdata = await invoke.makeHttpCall("post", "read", getdata);    
    if(userdata.data.statusMessage.length != 0){
      userdata.data.statusMessage[0].password=data.password;
    var updatedata = {
      url: process.env.DB_URL,
      client: "auth_user",
      docType: 0,
      query: userdata.data.statusMessage[0]
    };
    let mongo_data = await invoke.makeHttpCall("post", "userwrite", updatedata);  
    if(mongo_data.data.statusMessage.ok == 1){
     const response = await query("UPDATE auth_user SET password = '"+final_password +"' WHERE email = '"+data.email+"'")
      if(response.changedRows != 0){
        return "Password updated successfully";
      }else{
        return "polyglot doesn't update the password";
      }
     
    }else{
      return "user email doesn't exist";
    }
  }else{
    return "user email doesn't exist";
  }
  } catch (error) {
    return error.response.data
  }
}

let updatelinkstatus = async (data) => {
  try {
    data.is_active = false
    delete data.password
    var postdata = {
      url: process.env.DB_URL,
      client: "forgotpassword",
      docType: 0,
      query: data
    };
    let responsedata = await invoke.makeHttpCall("post", "userwrite", postdata);
    if (responsedata.data.errorMessage == null) {
      return true
    }
    else {
      return false
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

let checklink = async (data) => {
  try {
    var postdata = {
      url: process.env.DB_URL,
      client: "forgotpassword",
      docType: 0,
      query: { email: data.email }
    };
    let responsedata = await invoke.makeHttpCall("post", "read", postdata);
    if (responsedata.data.statusMessage != undefined) {
      var fp_data = responsedata.data.statusMessage
      if (fp_data.is_active == true) {
        var current_date = moment().format("YYYY-MM-DD");
        if (fp_data.valid_date == current_date) {
          var checklink_response = {
            status : true,
            _id : fp_data._id
          }
          return checklink_response
        }
        else {
          return 'Link Expired'
        }
      }
      else {
        return 'Link Verified'
      }
    }
    else {
      return false
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

module.exports = {
  putRecord,
  update_status,
  externalregistration,
  passwordencrypt,
  updatelinkstatus,
  checklink
};
