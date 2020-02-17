const invoke = require("../../lib/http/invoke");
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require("fs");
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.MYSQL_DB);
const util = require('util');
const query = util.promisify(connection.query).bind(connection);

//To get the order details.
let verifyemail = async request => {
  try {
    // Get content from file
    var contents = fs.readFileSync("./configuration/mailandsmsconfig/mailconfig.json");
    // Define to JSON type
    var jsonContent = JSON.parse(contents);
    // Logic For Sending Mail
    const readFile = util.promisify(fs.readFile);
    var html_path = "./configuration/mailandsmsconfig/verifyemail.html";
    var outcome = await readFile(html_path, { encoding: 'utf-8' });
    var template = handlebars.compile(outcome);
    var replacements = {
      name: request.name,
      email: request.email
    };
    var htmlToSend = template(replacements);
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: jsonContent.service,
      secure: jsonContent.secure,
      port: jsonContent.port,
      auth: {
        user: jsonContent.useremail,
        pass: jsonContent.password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: jsonContent.useremail + " " + "<CintanaEdu-Tech>",
      to: request.email,
      subject: "Edu-Tech Verification Mail",
      html: htmlToSend
    });
    if (info.messageId != undefined) {
      return true
    }
  } catch (err) {
    return { status: false };
  }
};

let checkemail = async request => {
  try {
    var readdata = {
      url: process.env.DB_URL,
      client: "auth_user",
      docType: 0,
      query: { email: request.email }
    };
    let response_data = await invoke.makeHttpCall("post", "read", readdata);
    if(response_data.data.statusMessage != undefined){
      if(response_data.data.statusMessage.is_active == false){
        return true
      }
      else{
        return "Email Address is Already verified"
      }
    }
    else{
      return "No User Information found with this Email Id"
    }
    // const rows = await query("select * from auth_user where email='" + request.email + "' and is_active = " + 0);
    // if (rows.length > 0) {
    //   return true
    // }
    // else {
    //   return false
    // }
  } catch (err) {
    return { status: false };
  }
}

let updateuser = async request => {
  try {
    var readdata = {
      url: process.env.DB_URL,
      client: "auth_user",
      docType: 0,
      query: { _id: request._id }
    };
    let response_data = await invoke.makeHttpCall("post", "read", readdata);
    if (response_data.data.statusMessage != undefined) {
      if (response_data.data.statusMessage.is_active == false) {
        request.is_active = true
        var postdata = {
          url: process.env.DB_URL,
          client: "auth_user",
          docType: 0,
          query: request
        };
        let responsedata = await invoke.makeHttpCall("post", "userwrite", postdata);
        const rows = await query("UPDATE auth_user set is_active = " + 1 + " where email='" + request.email + "'");
        return true
      }
      else {
        return "User Already Verified"
      }
    }
    else {
      return "No Data Exists"
    }
  } catch (err) {
    return { status: false };
  }
}

let getuserdetails = async request => {
  try {
    var readdata = {
      url: process.env.DB_URL,
      client: "auth_user",
      docType: 0,
      query: { email: request.email }
    };
    let response_data = await invoke.makeHttpCall("post", "read", readdata);
    if(response_data.data.statusMessage != undefined){
      return response_data.data.statusMessage
    }
    else{
      return false
    }
    // const rows = await query("select * from auth_user where email='" + request.email + "' and is_active = " + 1);
    // if (rows.length > 0) {
    //   return rows[0]
    // }
    // else {
    //   return false
    // }
  } catch (err) {
    return { status: false };
  }
}

let deleteuser = async request => {
  try {
    const rowsa = await query("SET FOREIGN_KEY_CHECKS = 0");
    const rows = await query("delete from auth_user where email ='" + request.email + "'");
    if (rows.affectedRows > 0) {
      return true
    }
    else {
      return false
    }
  } catch (err) {
    return { status: false };
  }
}

let getmysqldetailsfromserver = async request => {
  try {
    const rows = await query("select * from auth_user where email ='" + request.email + "'");
    if (rows.length > 0) {
      return rows[0]
    }
    else {
      return false
    }
  } catch (err) {
    return { status: false };
  }
}

let updatesuperuserstatus = async request => {
  try {
    var readdata = {
      url: process.env.DB_URL,
      client: "auth_user",
      docType: 0,
      query: { _id: request._id }
    };
    let response_data = await invoke.makeHttpCall("post", "read", readdata);
    if (response_data.data.statusMessage != undefined) {
      if (response_data.data.statusMessage.is_superuser == false) {
        request.is_superuser = true
        var postdata = {
          url: process.env.DB_URL,
          client: "auth_user",
          docType: 0,
          query: request
        };
        let responsedata = await invoke.makeHttpCall("post", "userwrite", postdata);
        const rows = await query("UPDATE auth_user set is_superuser = " + 1 + " where email='" + request.email + "'");
        return true
      }
      else {
        return "Super User Already Verified"
      }
    }
    else {
      return "No Data Exists"
    }
  } catch (err) {
    return { status: false };
  }
}

module.exports = {
  verifyemail,
  checkemail,
  updateuser,
  getuserdetails,
  deleteuser,
  getmysqldetailsfromserver,
  updatesuperuserstatus
};
