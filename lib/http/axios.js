let instance = {
  baseURL: process.env.DATA_SERVICE_ENDPOINT,
  timeout: 50000000,
  headers: { "Content-Type": "application/json" }
};
let instanceFynd = {
  baseURL: process.env.FYND_API_BASE,
  timeout: 50000000,
  headers: {
    "Content-Type": "application/json",
    "Fynd-Affiliate-Id": "e04b680f",
    "Fynd-Affiliate-Token": "be8096c3-84e7-479d-a6b8-1d62826bff86"
  }
};
let instanceBoonbox = {
  baseURL: process.env.IN_3_API,
  timeout: 50000000,
  headers: {
    "Content-Type": "application/json",
    "API-Id": "GHY897HJUT",
    "Username": "champ.user",
    "Consumer-Token":"hdf78-jj8s9-7yxej3-983jj"
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
    "api_id": "GHY695HJUT" ,
    "consumer-token": "hdf78-jj8s9-7yuej3-983jj"
  }
};
module.exports = {
  instance,
  instanceFynd,
  instanceBoonbox,
  instanceBoonboxCRM
};
