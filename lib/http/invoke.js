var httpReq = require("request");
Config = require("../../configuration");
const qs = require('querystring');
const axiosConfig = require("../../lib/http/axios").instance;
const axiosConfigpolyglot = require("../../lib/http/axios").instance_polyglot;
const axiosConfigpolyglotcms = require("../../lib/http/axios").instance_polyglot_cms;
const openedxaxiosConfig = require('../../lib/http/axios').openedx_instance;
const axios = require("axios");
var qArray = [];
var q = {
  url: "http://localhost:3000/",
  client: "",
  query: {},
  docType: "",
  selector: ""
},
  options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: ""
  };
module.exports = {
  makeHTTPRequest: function (options, callback, errorCallback) {
    options.gzip = true;
    options.timeout = "1200000";
    httpReq = require("request");
    httpReq(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (body === "") {
          callback({ message: "no result found" });
        } else {
          var info = JSON.parse(body);
          callback(info);
        }
      } else {
        callback({ error: true, message: body != "" ? body : error }, null);
      }
    });
  },
  getSVCPostRequestJSON: function (
    req,
    res,
    cSession,
    url,
    client,
    method,
    selector,
    docType,
    callback,
    svcURL,
    errorCallback
  ) {
    try {
      console.log(req);
      var that = this;
      var requestJSON = [],
        query = cSession;
      var reqQuery = JSON.parse(JSON.stringify(q));
      options.url = svcURL;
      var reqOptions = JSON.parse(JSON.stringify(options));
      reqOptions.url = url;
      reqOptions.body = JSON.stringify(query);
      reqOptions.method = method;

      that.makeHTTPRequest(
        reqOptions,
        function (response) {
          if (!callback) {
            if (!response || response.statusCode !== 200) {
              that.sendErrorResponse(
                res,
                response.statusCode,
                response.statusMessage
              );
            } else {
              that.sendResponse(res, response);
            }
          } else {
            callback(response);
          }
        },
        errorCallback
      );
    } catch (error) {
      logs.log(
        logs.errorLevel.Error,
        "common.getPostRequestJSON : " + url + "\n" + error
      );
      if (errorCallback) {
        errorCallback(error);
      } else {
        throw error;
      }
    }
  },
  getPostRequestJSON: function (
    req,
    res,
    cSession,
    url,
    client,
    method,
    selector,
    docType,
    callback,
    svcURL,
    errorCallback
  ) {
    try {
      var that = this;
      var requestJSON = [],
        query = cSession.b;
      if (query.mid && !(query.mid instanceof Array)) {
        if (
          query.mid !== undefined &&
          query.mid !== null &&
          !query.mid._bsontype
        ) {
          query.mid = query.mid.replace(":", "");
        }
        if (
          query._id !== undefined &&
          query._id !== null &&
          !query._id._bsontype
        ) {
          query._id = query._id.replace(":", "");
        }
      }
      var reqQuery = JSON.parse(JSON.stringify(q));
      options.url = svcURL;
      var reqOptions = JSON.parse(JSON.stringify(options));
      (reqQuery.url = cSession.db),
        (reqQuery.client = client),
        (reqQuery.query = query),
        (reqQuery.database = cSession.database),
        (reqQuery.dbsource = cSession.b ? cSession.dbsource : null),
        (reqQuery.store = cSession.store),
        (reqQuery.docType = docType),
        (reqQuery.selector = selector);
      //reqQuery.res = JSON.stringify(res);
      reqOptions.url = url;
      reqOptions.body = JSON.stringify(reqQuery);
      reqOptions.method = method;

      that.makeHTTPRequest(
        reqOptions,
        function (response) {
          if (!callback) {
            if (!response || response.statusCode !== 200) {
              that.sendErrorResponse(
                res,
                response.statusCode,
                response.statusMessage
              );
            } else {
              that.sendResponse(res, response);
            }
          } else {
            callback(response);
          }
        },
        errorCallback
      );
    } catch (error) {
      logs.log(
        logs.errorLevel.Error,
        "common.getPostRequestJSON : " + url + "\n" + error
      );
      if (errorCallback) {
        errorCallback(error);
      } else {
        throw error;
      }
    }
  },
  getGetRequestJSON: function (
    req,
    res,
    cSession,
    url,
    client,
    method,
    selector,
    docType,
    callback,
    svcURL,
    errorCallback
  ) {
    try {
      var that = this;
      var requestJSON = [],
        query = cSession.q;
      if (
        query.mid !== undefined &&
        query.mid !== null &&
        !query.mid._bsontype
      ) {
        query.mid = query.mid.replace(":", "");
      }
      if (
        query._id !== undefined &&
        query._id !== null &&
        !query._id._bsontype
      ) {
        query._id = query._id.replace(":", "");
      }
      var reqQuery = JSON.parse(JSON.stringify(q));
      options.url = svcURL;
      var reqOptions = JSON.parse(JSON.stringify(options));
      (reqQuery.url = cSession.db),
        (reqQuery.client = client),
        (reqQuery.database = cSession.database),
        (reqQuery.dbsource = cSession.b ? cSession.b.dbsource : null),
        (reqQuery.query = query),
        (reqQuery.docType = docType),
        (reqQuery.selector = selector);
      reqOptions.url = url;
      reqOptions.body = JSON.stringify(reqQuery);
      reqOptions.method = method;
      that.makeHTTPRequest(
        reqOptions,
        function (data) {
          if (!data || (data.error && res)) {
            res.send(
              JSON.stringify({
                statusCode: 500,
                statusMessage: "Service not running"
              })
            );
          } else {
            callback(data);
          }
        },
        errorCallback
      );
    } catch (error) {
      logs.log(
        logs.errorLevel.Error,
        "common.getGetRequestJSON : " + url + "\n" + error
      );
      if (errorCallback) {
        errorCallback(error);
      } else {
        throw error;
      }
    }
  },
  makeHttpCall: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCall(url);
        break;
      case "post":
        return await this.makePostCall(url, postParam);
        break;
      case "put":
        return await this.makePutCall(url, postParam);
        break;
      case "patch":
        return await this.makePatchCall(url, postParam);
        break;
    }
  },
  makeGetCall: async function (url, postParam) {
    let config = axiosConfig;
    // getparam["headers"] = {
    //   Authorization: "Bearer " + cookies.token
    // };
    return await axios.get(url, config);
  },
  makePostCall: async function (url, postParam) {
    let config = axiosConfig;
    return await axios.post(url, postParam, config);
  },
  makePutCall: async function (url, postParam) {
    let config = axiosConfig;
    return await axios.put(url, postParam, config);
  },
  makePatchCall: async function (url, postParam) {
    let config = axiosConfig;
    return await axios.patch(url, postParam, config);
  },
  makeHttpCallpolyglot: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCallpolyglot(url);
        break;
      case "post":
        return await this.makePostCallpolyglot(url, postParam);
        break;
      case "put":
        return await this.makePutCallpolyglot(url, postParam);
        break;
      case "patch":
        return await this.makePatchCallpolyglot(url, postParam);
        break;
    }
  },
  makeGetCallpolyglot: async function (url, postParam) {
    let config = axiosConfigpolyglot;
    // getparam["headers"] = {
    //   Authorization: "Bearer " + cookies.token
    // };
    return await axios.get(url, config);
  },
  makePostCallpolyglot: async function (url, postParam) {
    let config = axiosConfigpolyglot;
    return await axios.post(url, qs.stringify(postParam), config);
  },
  makePutCallpolyglot: async function (url, postParam) {
    let config = axiosConfigpolyglot;
    return await axios.put(url, postParam, config);
  },
  makePatchCallpolyglot: async function (url, postParam) {
    let config = axiosConfigpolyglot;
    return await axios.patch(url, postParam, config);
  },
  //////////////////////
  makeHttpCallpolyglotCMS: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCallpolyglotcms(url);
        break;
      case "post":
        return await this.makePostCallpolyglotcms(url, postParam);
        break;
      case "put":
        return await this.makePutCallpolyglotcms(url, postParam);
        break;
      case "patch":
        return await this.makePatchCallpolyglotcms(url, postParam);
        break;
    }
  },
  makeGetCallpolyglotcms: async function (url, postParam) {
    let config = axiosConfigpolyglotcms;
    // getparam["headers"] = {
    //   Authorization: "Bearer " + cookies.token
    // };
    return await axios.get(url, config);
  },
  makePostCallpolyglotcms: async function (url, postParam) {
    let config = axiosConfigpolyglotcms;
    return await axios.post(url, postParam, config);
  },
  makePutCallpolyglotcms: async function (url, postParam) {
    let config = axiosConfigpolyglotcms;
    return await axios.put(url, postParam, config);
  },
  makePatchCallpolyglotcms: async function (url, postParam) {
    let config = axiosConfigpolyglotcms;
    return await axios.patch(url, postParam, config);
  },
  openedxCall: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.openedxCallGetCall(url);
        break;
      case "post":
        return await this.openedxCallPostCall(url, postParam);
        break;
      case "put":
        return await this.openedxCallPutCall(url, postParam);
        break;
      case "patch":
        return await this.openedxCallPatchCall(url, postParam);
        break;
    }
  },
  openedxCallGetCall: async function (url, postParam) {
    let config = openedxaxiosConfig;
    return axios.get(url, config);
  },
  openedxCallPostCall: async function (url, postParam) {
    let config = openedxaxiosConfig;
    return await axios.post(url, qs.stringify(postParam), config)
  },
  openedxCallPutCall: async function (url, postParam) {
    let config = openedxaxiosConfig;
    return await axios.put(url, postParam, config);
  },
  openedxCallPatchCall: async function (url, postParam) {
    let config = openedxaxiosConfig;
    return await axios.patch(url, postParam, config);
  }
};
