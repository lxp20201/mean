const invoke = require("../../lib/http/invoke");
const crypto = require('crypto');
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.MYSQL_DB);
const util = require('util');
const query = util.promisify(connection.query).bind(connection);
const pbkdf2 = require('pbkdf2')
var randomstring = require("randomstring");

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
    return final_password; 
  } catch (error) {
    return error.response.data
  }
}

module.exports = {
  putRecord, update_status, externalregistration, passwordencrypt
};
