const invoke = require("../../lib/http/invoke");


let checkemail = async request => {
  try {
    var postdata = {
        url: process.env.DB_URL,
        client: "auth_user",
        docType: 1,
        query: { email: request.email,password: request.password }
      };
      let redata = await invoke.makeHttpCall("post", "read", postdata);
      response = redata;  
      return response.data;
  } catch (err) {
    return { status: false };
  }
}

module.exports = {
  checkemail
};
