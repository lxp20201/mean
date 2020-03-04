let instance = {
  baseURL: process.env.DATA_SERVICE_ENDPOINT,
  timeout: 50000000,
  headers: { "Content-Type": "application/json" }
};
let instance_polyglot = {
  baseURL: process.env.EXTERNAL_PORT,
  timeout: 50000000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/json"
  }
};
let instance_polyglot_cms = {
  baseURL: process.env.CMS_EXTERNAL_PORT,
  timeout: 50000000,
  headers: {
    "Content-Type": "application/json",
    "Accept" : "application/json"
  }
};
let openedx_instance = {
  baseURL: process.env.EXTERNAL_PORT,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    "Accept": "application/json"
  }
};
module.exports = {
  instance,
  instance_polyglot,
  instance_polyglot_cms,
  openedx_instance
};
