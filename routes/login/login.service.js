const invoke = require("../../lib/http/invoke");
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require("fs");
const util = require('util');

let checkemail = async request => {
  try {
    var postdata = {
      url: process.env.DB_URL,
      client: "auth_user",
      docType: 1,
      query: { email: request.email, password: request.password, is_staff : request.is_staff }
    };
    let redata = await invoke.makeHttpCall("post", "read", postdata);
    response = redata;
    return response.data;
  } catch (err) {
    return { status: false };
  }
}

let sendforgotpasswordmail = async request => {
  try {
    var postdata = {
      url: process.env.DB_URL,
      client: "auth_user",
      docType: 0,
      query: { email: request.email }
    };
    let redata = await invoke.makeHttpCall("post", "read", postdata);
    if (redata.data.statusMessage != undefined) {
      // Get content from file
      var contents = fs.readFileSync("./configuration/mailandsmsconfig/mailconfig.json");
      // Define to JSON type
      var jsonContent = JSON.parse(contents);
      // Logic For Sending Mail
      const readFile = util.promisify(fs.readFile);
      var html_path = "./configuration/mailandsmsconfig/forgotpassword.html";
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
        subject: "Edu-Tech Forgot Password Mail",
        html: htmlToSend
      });
      if (info.messageId != undefined) {
        return true
      }
      else{
        return "Invalid Email"
      }
    }
    else {
      return "No Such Mail Exists"
    }
  } catch (err) {
    return { status: false };
  }
}
module.exports = {
  checkemail,
  sendforgotpasswordmail
};
