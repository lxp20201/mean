const invoke = require("../../lib/http/invoke");
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require("fs");
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.MYSQL_DB);
const util = require('util');
const query = util.promisify(connection.query).bind(connection);

//To get the order details.
let adminuserdashboard = async request => {
    try {
        if(request.is_staff == undefined){
            return false
        }
        else{
            var readdata = {
                url: process.env.DB_URL,
                client: "auth_user",
                docType: 1,
                query: { is_staff: request.is_staff, is_superuser : false }
            };
            let response_data = await invoke.makeHttpCall("post", "read", readdata);
            if (response_data.data.statusMessage != undefined) {
                return response_data.data.statusMessage
            }
            else {
                return false
            }
        }
    } catch (err) {
        return { status: false };
    }
};

module.exports = {
    adminuserdashboard
};
