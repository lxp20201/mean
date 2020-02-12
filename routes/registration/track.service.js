const invoke = require("../../lib/http/invoke");
const crypto = require('crypto');
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.MYSQL_DB);
const util = require('util');
const query = util.promisify(connection.query).bind(connection);
var pbkdf2 = require('pbkdf2')
const passwordHash = require('pbkdf2-password-hash')
const qs = require('querystring');

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

let register = async (data) => {
  try {

    const rows = await query("INSERT INTO auth_user (username, first_name, last_name, password, is_superuser, email, is_staff, is_active, date_joined) VALUES ('" + data.username + "', '" + data.name + "', '" + data.last_name + "', '" + data.password + "', '" + data.is_superuser + "', '" + data.email + "', '" + data.is_staff + "', '" + data.is_active + "', '" + data.date_joined + "');")
    console.log(rows);
  } catch (error) {
    console.log(error)
    return false
  }
}

let externalregistration = async (request) => {
  try {
    var payload = request;
    var response = await invoke.makeHttpCallpolyglot("post", "/user_api/v1/account/registration/", payload);
    if (response.data.success == true) {
      var postdata = {
        url: process.env.DB_URL,
        client: "auth_user",
        docType: 0,
        query: request
      };
      let responsedata = await invoke.makeHttpCall("post", "write", postdata);
      return true;
    }
    else {
      return response.data
    }
  } catch (error) {
    return error.response.data
  }
}

module.exports = {
  putRecord, register, externalregistration
};
