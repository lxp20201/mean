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
      from: "'" + jsonContent.useremail + " " + "<Cintana Edu-Tech>" + "'",
      to: request.email,
      subject: "Edu-Tech Verification Mail",
      html: htmlToSend
    });
    if(info.messageId != undefined){
      return true
    }
  } catch (err) {
    return { status: false };
  }
};

let checkemail = async request => {
  try {
    const rows = await query("select * from auth_user where email='" + request.email + "' and is_active = " + 0);
    if (rows.length > 0) {
      return true
    }
    else {
      return false
    }
  } catch (err) {
    return { status: false };
  }
}

let updateuser = async request => {
  try {
    const rows = await query("UPDATE auth_user set is_active = " + 1 + " where email='" + request.email + "'");
    console.log(rows);
  } catch (err) {
    return { status: false };
  }
}

let getuserdetails = async request => {
  try {
    const rows = await query("select * from auth_user where email='" + request.email + "' and is_active = " + 1);
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

module.exports = {
  verifyemail,
  checkemail,
  updateuser,
  getuserdetails
};
