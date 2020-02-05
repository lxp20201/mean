const invoke = require("../../lib/http/invoke");
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require("fs");

//To get the order details.
let verifyemail = async request => {
  try {
    // Get content from file
    var contents = fs.readFileSync("./configuration/mailandsmsconfig/mailconfig.json");
    // Define to JSON type
    var jsonContent = JSON.parse(contents);
    // Logic For Sending Mail
    var readHTMLFile = function (path, callback) {
      fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
          callback(err);
        }
        else {
          callback(null, html);
        }
      });
    };
    // Logic For Sending Mail
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
    //changepasswordmail
    readHTMLFile('./configuration/mailandsmsconfig/verifyemail.html', function (err, html) {
      var template = handlebars.compile(html);
      var replacements = {
        name: request.name,
        email: request.email
      };
      var htmlToSend = template(replacements);
      let HelpOptions = { // function for the details of User and Sender.;
        from: jsonContent.useremail + ' <Cintana Edu-Tech>',
        to: request.email,
        subject: "Edu-Tech Verification Mail",
        html: htmlToSend
      };
      transporter.sendMail(HelpOptions, (error, info) => { //Report information whether mail has sent or not
        if (error) {
          //   callback(error);
        } else {
          callback(null, info.response[0]);
        }
      });
    });
    return true
    // var postdata = {
    //   url: process.env.DB_URL,
    //   client: "orders",
    //   docType: 0,
    //   query: { _id: orderid }
    // };
    // let orderdata = await invoke.makeHttpCall("post", "read", postdata);
    // return orderdata.data.statusMessage;
  } catch (err) {
    return { status: false };
  }
};

let checkemail = async request => {
  try {
    var postdata = {
      url: process.env.DB_URL,
      client: "auth_user",
      docType: 0,
      query: { email: request.email, is_active: false }
    };
    let orderdata = await invoke.makeHttpCall("post", "read", postdata);
    if (orderdata.data.statusMessage != null) {
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
    request.is_active = true
    var postdata = {
      url: process.env.DB_URL,
      client: "auth_user",
      docType: 0,
      query: request
    };
    let orderdata = await invoke.makeHttpCall("post", "userwrite", postdata);
  } catch (err) {
    return { status: false };
  }
}

module.exports = {
  verifyemail,
  checkemail,
  updateuser
};
