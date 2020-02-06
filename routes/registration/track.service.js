const invoke = require("../../lib/http/invoke");
const crypto = require('crypto');
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.MYSQL_DB);
const util = require('util');
const query = util.promisify(connection.query).bind(connection);
var pbkdf2 = require('pbkdf2')
const passwordHash = require('pbkdf2-password-hash')

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

let register=async(data)=>{
    try{

    const rows = await query("INSERT INTO auth_user (username, first_name, last_name, password, is_superuser, email, is_staff, is_active, date_joined) VALUES ('" + data.username + "', '" + data.name + "', '" + data.last_name + "', '" + data.password + "', '" + data.is_superuser + "', '" + data.email + "', '" + data.is_staff + "', '" + data.is_active + "', '" + data.date_joined + "');")
    console.log(rows);
    }catch(error){
    console.log(error)
        return false
    }
}

function hashPassword(password) {
  // const salt = crypto.randomBytes(16).toString('hex');
  // var key = crypto.pbkdf2Sync(password, input.salt, input.iterations, input.length)
  // const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha256').toString('hex');
  // return [salt, hash].join('$');
  return passwordHash.hash(password, {iterations: 36000, digest: 'sha256', saltlen: 16})
.then((hash) => {
  console.log('pbkdf2_'+hash,'llllllllllllllllllllllll')
  //> hash === 'sha1$100$16$fwzPKhZjCQSZMz+hY7A29A==$KdGdduxkKd08FDUuUVDVRQ=='
})
  // return encrypted_password
  }

module.exports = {
  putRecord,register,hashPassword
};
