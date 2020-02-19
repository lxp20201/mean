let instance = {
  baseURL: process.env.DATA_SERVICE_ENDPOINT,
  timeout: 50000000,
  headers: { "Content-Type": "application/json" }
};
let instanceFynd = {
  baseURL: process.env.EXTERNAL_PORT,
  timeout: 50000000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    // "Content-Length" : 164,
    // 'Access-Control-Allow-Origin': "*",
    // 'Access-Control-Allow-Methods': "GET,POST,OPTIONS,DELETE,PUT"
  }
};
let instanceBoonbox = {
  baseURL: process.env.CMS_EXTERNAL_PORT,
  timeout: 50000000,
  headers: {
    "Content-Type": "application/json"
  }
};
let instanceBoonboxCRM = {
  baseURL: process.env.customerCareCRM,
  timeout: 50000000,
  //this is for live
  /*  headers: {
      "Content-Type": "application/json",
      "Username": "champ.user",
      "Api-Id": "GHY897HJUT" ,
      "Consumer-Token": "hdf78-jj8s9-7yxej3-983jj"
    }*/
  //this is for testing
  headers: {
    "Content-Type": "application/json",
    "username": "demo.user",
    "api_id": "GHY695HJUT",
    "consumer-token": "hdf78-jj8s9-7yuej3-983jj"
  }
};
let openedx_instance = {
  baseURL: process.env.EXTERNAL_PORT,
  // timeout: 50000000,
  headers: { 'Content-Type':'application/x-www-form-urlencoded' }   //'Accept': 'application/json',
         };
module.exports = {
  instance,
  instanceFynd,
  instanceBoonbox,
  instanceBoonboxCRM,
  openedx_instance
};
