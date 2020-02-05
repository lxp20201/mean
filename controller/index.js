module.exports = function (params) {
  var app = params.app;
  var _=require('lodash')
  var allcollection=[]
  var documentType = {
    Single: 0,
    Distinct: -1,
    Collection: 1,
    Master: 2
  };
  var mongo = require("../datasource/mongodbs.js"),
    ObjectID = require("mongodb").ObjectID;

  var writeData = function (
    dataArray,
    counter,
    query,
    mongo,
    callback,
    keyIdentifier
  ) {
    if (dataArray && counter < dataArray.length) {
      var data = dataArray[counter];
      if (data._id === undefined && !keyIdentifier) {
        data["createdOn"] = Date.now();
        mongo.insertDocument(query.url, query.client, data, function (
          result,
          err
        ) {
          if (err !== null) {
            callback(err, result);
          } else {
            counter = counter + 1;
            writeData(
              dataArray,
              counter,
              query,
              mongo,
              callback,
              keyIdentifier
            );
          }
        });
      } else {
        data["updatedon"] = Date.now();
        mongo.updateDocument(
          query.url,
          query.client,
          data,
          function (result, err) {
            // console.log("Mongo update err", err);
            if (err !== null) {
              callback(err, result);
            } else {
              counter++;
              writeData(
                dataArray,
                counter,
                query,
                mongo,
                callback,
                keyIdentifier
              );
            }
          },
          keyIdentifier
        );
      }
    } else {
      callback(null, {
        Success: true
      });
    }
  };
  var sendResponse = function (dsres, data, err) {
    dsres.send(
      JSON.stringify({
        statusCode: -100,
        statusMessage: data,
        errorMessage: err,
        iid: data !== null ? data.insertedId : null
      })
    );
  };
  app
    .post("/read", function (req, res) {
      "use strict";
      var collectionStatus,collectionName;
      if(allcollection.length==0){
        allcollection.push(req.body.client)
        var unique=_.uniq(allcollection)
        var IndexNumber=unique.indexOf(req.body.client)
        app.locals.collection = unique;
        const collection = req.app.locals.collection[IndexNumber];
      }else{
        //allcollection.push(req.body.client)
        var unique=_.uniq(allcollection)
        var IndexNumber=unique.indexOf(req.body.client)
        if(IndexNumber==-1){
          allcollection.push(req.body.client)
          var unique=_.uniq(allcollection)
          collectionStatus=false
        }else{
          collectionStatus=true
        }
        app.locals.collection = unique;
        if(IndexNumber!=-1)
          collectionName = req.app.locals.collection[IndexNumber];
      }
      var query = req.body;
      if (query.docType === documentType.Collection) {
        if (query.query !== null && query.query !== undefined) {
          if (
            query.query._id !== undefined &&
            query.query._id !== null &&
            !Array.isArray(query.query._id)
          ) {
            query.query._id = ObjectID(query.query._id);
          }
        }
        if (Array.isArray(query.query._id)) {
          var arrayofObjectid = [];
          for (var m = 0; m < query.query._id.length; m++) {
            arrayofObjectid.push(ObjectID(query.query._id[m]));
          }
          query.query = {
            _id: {
              $in: arrayofObjectid
            }
          };
        }
        if(collectionName==undefined||IndexNumber==-1){
          mongo.findDocuments(
            query.url,
            query.client,
            query.query,
            function (err, data) {
              //console.log(err,data);
              sendResponse(res, err, data);
            },
            query.selector
          );
        }else{
          mongo.findDocuments(
            query.url,
            collectionName,
            query.query,
            function (err, data) {
              //console.log(err,data);
              sendResponse(res, err, data);
            },
            query.selector
          );
        }
      } else if (query.docType === documentType.Distinct) {
       

        if(collectionName==undefined||IndexNumber==-1){
          mongo.distinct(query.url, query.client, query.query, function (
          err,
          data
        ) {
          sendResponse(res, err, data);
        });
        }else{
          mongo.distinct(query.url, collectionName, query.query, function (
          err,
          data
        ) {
          sendResponse(res, err, data);
        });
        }
      } else if (query.docType === documentType.Single) {
        var qq = {};
        if (query.query !== null && query.query !== undefined) {
          qq = query.query;
          if (qq._id !== undefined && qq._id !== null) {
            qq._id = ObjectID(qq._id);
          }
        }
        if(collectionName==undefined||IndexNumber==-1){
        mongo.findDocument(
          query.url,
          query.client,
          qq,
          function (data, err) {
            //console.log(data,err);
            sendResponse(res, data, err);
          },
          null
        );
        }else{
          mongo.findDocument(
            query.url,
            collectionName,
            qq,
            function (data, err) {
              //console.log(data,err);
              sendResponse(res, data, err);
            },
            null
          );
        }
      } else if (query.docType === documentType.Master) {
        query.query._id = ObjectID(query.query._id);
        if(collectionName==undefined||IndexNumber==-1){
        mongo.findDocuments(
          query.url,
          query.client,
          query.query,
          function (err, data) {
            sendResponse(res, err, data);
          },
          query.selector
        );
        }else{
          mongo.findDocuments(
            query.url,
            query.client,
            query.query,
            function (err, data) {
              sendResponse(res, err, data);
            },
            query.selector
          );
        }
      } else {
        res.send(
          JSON.stringify({
            result: null,
            error: "Invalide call"
          })
        );
      }
    })
    .post("/remove", function (req, res) {
      "use strict";
      var query = req.body,
        data = query.query;
      if (data._id) {
        data._id = ObjectID(data._id);
      }
      mongo.removeDocument(query.url, query.client, data, function (
        err,
        result
      ) {
        sendResponse(res, err, result);
      });
    })
    .post("/doAdmin", function (req, res) {
      "use strict";
      var query = req.body,
        data = query.query;
      mongo.doAdmin(query.url, query.client, data, function (err, result) {
        sendResponse(res, err, result);
      });
    })
    .post("/write", function (req, res) {
      "use strict";
      var collectionStatus,collectionName;
      if(allcollection.length==0){
        allcollection.push(req.body.client)
        var unique=_.uniq(allcollection)
        var IndexNumber=unique.indexOf(req.body.client)
        app.locals.collection = unique;
        const collection = req.app.locals.collection[IndexNumber];
      }else{
        //allcollection.push(req.body.client)
        var unique=_.uniq(allcollection)
        var IndexNumber=unique.indexOf(req.body.client)
        if(IndexNumber==-1){
          allcollection.push(req.body.client)
          var unique=_.uniq(allcollection)
          collectionStatus=false
        }else{
          collectionStatus=true
        }
        app.locals.collection = unique;
        if(IndexNumber!=-1)
          collectionName = req.app.locals.collection[IndexNumber];
      }
      var query = req.body,
        data = query.query,
        keyIdentifier = query.keyIdentifier;
      if (query.docType == documentType.Single) {
        if (data._id === undefined) {
          if(collectionName==undefined||IndexNumber==-1){
            mongo.insertDocument(query.url, query.client, data, function (
              err,
              result
            ) {
              sendResponse(res, err, result);
            });
        }else{
          mongo.insertDocument(query.url, collectionName, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        }
        } else {
          if(collectionName==undefined||IndexNumber==-1){
            mongo.updateDocument(query.url, query.client, data, function (
              err,
              result
            ) {
              sendResponse(res, err, result);
            });
          }else{
            mongo.updateDocument(query.url, collectionName, data, function (
              err,
              result
            ) {
              sendResponse(res, err, result);
            });
          }
        }
      } else if (query.docType == documentType.Collection) {
        writeData(
          data,
          0,
          query,
          mongo,
          function (err, result) {
            sendResponse(res, result, err);
          },
          keyIdentifier
        );
      } else {
        res.send(
          JSON.stringify({
            result: null,
            error: "Invalide call"
          })
        );
      }
    })
    .post("/usertrem", function (req, res) {
      "use strict";
      var query = req.body,
        data = query.query;
      if (query.client === "tenants") {
        mongo.usertrem(query.url, query.client, {}, function (err, result) {
          sendResponse(res, null, {
            Success: true
          });
        });
      } else {
        sendResponse(res, null, {
          Success: true
        });
      }
    })
    .post("/sort", function (req, res) {
      "use strict";
      var query = req.body;
      if (query.docType === documentType.Collection) {
        mongo.sort(
          query.url,
          query.client,
          query.query,
          query.pageNum,
          function (err, data) {
            //console.log(err,data);
            sendResponse(res, err, data);
          },
          query.selector
        );
      } else {
        res.send(
          JSON.stringify({
            result: null,
            error: "Invalide call"
          })
        );
      }
    })
    .post("/aggregate", function (req, res) {
      "use strict";
      var collectionStatus,collectionName;
      if(allcollection.length==0){
        allcollection.push(req.body.client)
        var unique=_.uniq(allcollection)
        var IndexNumber=unique.indexOf(req.body.client)
        app.locals.collection = unique;
        const collection = req.app.locals.collection[IndexNumber];
      }else{
        //allcollection.push(req.body.client)
        var unique=_.uniq(allcollection)
        var IndexNumber=unique.indexOf(req.body.client)
        if(IndexNumber==-1){
          allcollection.push(req.body.client)
          var unique=_.uniq(allcollection)
          collectionStatus=false
        }else{
          collectionStatus=true
        }
        app.locals.collection = unique;
        if(IndexNumber!=-1)
          collectionName = req.app.locals.collection[IndexNumber];
      }
      var query = req.body;
      if (query.docType === documentType.Collection) { //collectionName,
        if(collectionName==undefined||IndexNumber==-1){
        mongo.aggregate(
          query.url,
          query.client,
          query.query,
          function (err, data) {
            //console.log(err,data);
            sendResponse(res, err, data);
          },
          query.selector
        );
        }else{
          mongo.aggregate(
            query.url,
            collectionName,
            query.query,
            function (err, data) {
              //console.log(err,data);
              sendResponse(res, err, data);
            },
            query.selector
          );
        }
      } else {
        res.send(
          JSON.stringify({
            result: null,
            error: "Invalide call"
          })
        );
      }
    })



    .post("/objectwrite", function (req, res) {
      "use strict";
      var query = req.body,
        data = {
          _id: req.body.query._id,
          country: new ObjectID(req.body.query.country),
          state: new ObjectID(req.body.query.state),
          district: new ObjectID(req.body.query.district),
          subdistrict: new ObjectID(req.body.query.subdistrict),
          villagename: req.body.query.villagename,
          pincode: req.body.query.pincode,
          status: req.body.query.status,
          updated_by: new Date()
        },

        keyIdentifier = query.keyIdentifier;
      if (query.docType == documentType.Single) {
        if (data._id === undefined) {
          mongo.insertDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        } else {
          mongo.updateDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        }
      } else if (query.docType == documentType.Collection) {
        writeData(
          data,
          0,
          query,
          mongo,
          function (err, result) {
            sendResponse(res, result, err);
          },
          keyIdentifier
        );
      } else {
        res.send(
          JSON.stringify({
            result: null,
            error: "Invalide call"
          })
        );
      }
    })
    .post("/objectstatewrite", function (req, res) {
      "use strict";
      var query = req.body,
        data = {
          _id: req.body.query._id,
          country: new ObjectID(req.body.query.country),
          stateshortcode: req.body.query.stateshortcode,
          statename: req.body.query.statename,
          status: req.body.query.status,
          updated_by: new Date()
        },

        keyIdentifier = query.keyIdentifier;
      if (query.docType == documentType.Single) {
        if (data._id === undefined) {
          mongo.insertDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        } else {
          mongo.updateDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        }
      } else if (query.docType == documentType.Collection) {
        writeData(
          data,
          0,
          query,
          mongo,
          function (err, result) {
            sendResponse(res, result, err);
          },
          keyIdentifier
        );
      } else {
        res.send(
          JSON.stringify({
            result: null,
            error: "Invalide call"
          })
        );
      }
    })
    .post("/objectdistrictwrite", function (req, res) {
      "use strict";
      var query = req.body,
        data = {
          _id: req.body.query._id,
          country: [new ObjectID(req.body.query.country)],
          state: [new ObjectID(req.body.query.state)],
          districtname: req.body.query.districtname,
          status: req.body.query.status,
          updated_by: new Date()
        },

        keyIdentifier = query.keyIdentifier;
      if (query.docType == documentType.Single) {
        if (data._id === undefined) {
          mongo.insertDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        } else {
          mongo.updateDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        }
      } else if (query.docType == documentType.Collection) {
        writeData(
          data,
          0,
          query,
          mongo,
          function (err, result) {
            sendResponse(res, result, err);
          },
          keyIdentifier
        );
      } else {
        res.send(
          JSON.stringify({
            result: null,
            error: "Invalide call"
          })
        );
      }
    })
    .post("/objectsubdistrictwrite", function (req, res) {
      "use strict";
      var query = req.body,
        data = {
          _id: req.body.query._id,
          country: [new ObjectID(req.body.query.country)],
          state: [new ObjectID(req.body.query.state)],
          district: [new ObjectID(req.body.query.district)],
          subdistrictname: req.body.query.subdistrictname,
          status: req.body.query.status,
          updated_by: new Date()
        },

        keyIdentifier = query.keyIdentifier;
      if (query.docType == documentType.Single) {
        if (data._id === undefined) {
          mongo.insertDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        } else {
          mongo.updateDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        }
      } else if (query.docType == documentType.Collection) {
        writeData(
          data,
          0,
          query,
          mongo,
          function (err, result) {
            sendResponse(res, result, err);
          },
          keyIdentifier
        );
      } else {
        res.send(
          JSON.stringify({
            result: null,
            error: "Invalide call"
          })
        );
      }
    })
    .post("/objectpincodewrite", function (req, res) {
      "use strict";
      var query = req.body,
        data = {
          _id: req.body.query._id,
          country: new ObjectID(req.body.query.country),
          state: new ObjectID(req.body.query.state),
          district: new ObjectID(req.body.query.district),
          subdistrict: new ObjectID(req.body.query.subdistrict),
          pincode: req.body.query.pincode,
          status: req.body.query.status,
          updated_by: new Date()
        },

        keyIdentifier = query.keyIdentifier;
      if (query.docType == documentType.Single) {
        if (data._id === undefined) {
          mongo.insertDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        } else {
          mongo.updateDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        }
      } else if (query.docType == documentType.Collection) {
        writeData(
          data,
          0,
          query,
          mongo,
          function (err, result) {
            sendResponse(res, result, err);
          },
          keyIdentifier
        );
      } else {
        res.send(
          JSON.stringify({
            result: null,
            error: "Invalide call"
          })
        );
      }
    })
    .post("/userwrite", function (req, res) {
      "use strict";
      var query = req.body,
        data = query.query,
        keyIdentifier = query.keyIdentifier;
      if (query.docType == documentType.Single) {
        if (data._id === undefined) {
          mongo.insertDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        } else {
          mongo.newupdateDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        }
      } else if (query.docType == documentType.Collection) {
        writeData(
          data,
          0,
          query,
          mongo,
          function (err, result) {
            sendResponse(res, result, err);
          },
          keyIdentifier
        );
      } else {
        res.send(
          JSON.stringify({
            result: null,
            error: "Invalide call"
          })
        );
      }
    })

    .post("/userpush", function (req, res) {
      "use strict";
      var query = req.body,
        data = query.query,
        keyIdentifier = query.keyIdentifier;
      if (query.docType == documentType.Single) {
        if (data._id === undefined) {
          mongo.insertDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        } else {
          mongo.newpushDocument(query.url, query.client, data, function (
            err,
            result
          ) {
            sendResponse(res, err, result);
          });
        }
      } else if (query.docType == documentType.Collection) {
        writeData(
          data,
          0,
          query,
          mongo,
          function (err, result) {
            sendResponse(res, result, err);
          },
          keyIdentifier
        );
      } else {
        res.send(
          JSON.stringify({
            result: null,
            error: "Invalide call"
          })
        );
      }
    })
};
