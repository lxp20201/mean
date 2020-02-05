const invoke = require("../../lib/http/invoke");

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

module.exports = {
  putRecord
};
