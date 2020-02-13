/*jslint node:true */

var MongoClient = require("mongodb").MongoClient,
  dbConnection = new Array(25),
  ObjectId = require("mongodb").ObjectID;

function connectDB(url, callBack) {
  "use strict";
  // Use connect method to connect to the Server
  MongoClient.connect(
    url,{
      bufferMaxEntries: 10000, autoReconnect: true, poolSize: 100, connectTimeoutMS: 300000, socketTimeoutMS: 300000, useNewUrlParser: true,useUnifiedTopology: true
    },
    function(err, db) {
      //console.log("error variable",err,"db variable",db)
      if (err) {
        callBack(null, err);
      } else {
        callBack(db.db("dev_openedx"),db, null);
      }
    }
  );
}

function connect(cnString, callBack) {
  "use strict";
  try {
    connectDB(cnString, function(db,dbobj, err) {
      callBack(db,dbobj, err);
      
    });
  } catch (ex) {
    callBack(null, ex);
  }
}

module.exports.doAdmin = function(cnString, tabl, data, callback) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tabl);
          data._id = ObjectId("5acf728c86f5dca08a04c090");
          collection.insertOne(data, function(err, result) {
            dbobj.close();
            if (!err) {
              callback(result, null);
            } else {
              callback(null, err);
            }
          });
        } else {
          callback(null, err);
        }
      }
    );
  } catch (ex) {
    callback(null, ex);
  }
};

module.exports.insertDocument = function(cnString, tabl, data, callback) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tabl);
          collection.insertOne(data, function(err, result) {
            dbobj.close();
            if (!err) {
              callback(result, null);
            } else {
              dbobj.close();
              callback(null, err);
            }
          });
        } else {
          dbobj.close();
          callback(null, err);
        }
      }
    );
  } catch (ex) {
    console.log(ex,'connection not closed..')
    callback(null, ex);
  }
};
module.exports.newupdateDocument = function(
  cnString,
  tabl,
  data,
  callback,
  keyIdentifier
) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tabl);
          if (keyIdentifier) {
            var id = keyIdentifier;
            var q = {};
            q[id] = data[id];
            console.log(q);
            collection.replaceOne(
              q,
              data,
              {
                upsert: true
              },
              function(err, result) {
                //console.log(err, result);
                dbobj.close();
                if (!err) {
                  callback(result, null);
                } else {
                  callback(null, err);
                }
              }
            );
          } else {
            var id = new ObjectId(data._id);
            delete data._id;
            collection.update(
              {
                _id: id
              },
             {$set:data} ,
              function(err, result) {
                //db.close();
                if (!err) {
                  callback(result, null);
                } else {
                  callback(null, err);
                }
              }
            );
          }
        } else {
          callback(null, err);
        }
      }
    );
  } catch (ex) {
    callback(null, ex);
  }
};
module.exports.updateDocument = function(
  cnString,
  tabl,
  data,
  callback,
  keyIdentifier
) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tabl);
          if (keyIdentifier) {
            var id = keyIdentifier;
            var q = {};
            q[id] = data[id];
            //console.log(q);
            collection.replaceOne(
              q,
              data,
              {
                upsert: true
              },
              function(err, result) {
                //console.log(err, result);
                dbobj.close();
                if (!err) {
                  callback(result, null);
                } else {
                  dbobj.close();
                  callback(null, err);
                }
              }
            );
          } else {
            var id = new ObjectId(data._id);
            delete data._id;
            collection.replaceOne(
              {
                _id: id
              },
              data,
              function(err, result) {
                //db.close();
                if (!err) {
                  callback(result, null);
                } else {
                  dbobj.close();
                  callback(null, err);
                }
              }
            );
          }
        } else {
          dbobj.close();
          callback(null, err);
        }
      }
    );
  } catch (ex) {
    console.log(ex,'connection not closed..')
    callback(null, ex);
  }
};

module.exports.upsertDocument = function(cnString, tabl, data, callback) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tabl);
          var id = data.name;
          delete data._id;
          collection.replaceOne(
            {
              name: id
            },
            data,
            {
              upsert: true
            },
            function(err, result) {
              dbobj.close();
              if (!err) {
                callback(result, null);
              } else {
                dbobj.close();
                callback(null, err);
              }
            }
          );
        } else {
          dbobj.close();
          callback(null, err);
        }
      }
    );
  } catch (ex) {
    console.log(ex,'connection not closed..')
    callback(null, ex);
  }
};

module.exports.usertrem = function(cnString, tabl, data, callback) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tabl);
          var id = data.name;
          delete data._id;
          collection.remove({}, function(err, result) {
            dbobj.close();
            if (!err) {
              callback(result, null);
            } else {
              dbobj.close();
              callback(null, err);
            }
          });
        } else {
          dbobj.close();
          callback(null, err);
        }
      }
    );
  } catch (ex) {
    console.log(ex,'connection not closed...')
    callback(null, ex);
  }
};

module.exports.insertDocuments = function(cnString, tabl, data, callback) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          // Get the documents collection
          var collection = db.collection(tabl);
          // Insert some documents
          collection.insertMany(data, function(err, result) {
            dbobj.close();
            if (!err) {
              callback(result, null);
            } else {
              dbobj.close();
              callback(null, err);
            }
          });
        }else{
          dbobj.close();
        }
      }
    );
  } catch (ex) {
    console.log(ex,'connection not closed..')
    callback(null, ex);
  }
};

module.exports.listCollections = function(cnString, callback) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          // Get the documents collection
          db.collections(function(err, collections) {
            dbobj.close();
            if (!err) {
              callback(null, collections);
            } else {
              dbobj.close();
              callback(err, null);
            }
          });
        }else{
          dbobj.close();
        }
      }
    );
  } catch (ex) {
    console.log(ex,'connection not closed.')
    callback(null, ex);
  }
};

module.exports.findDocuments = function(
  cnString,
  tbl,
  query,
  callback,
  selector
) {
  "use strict";
  try {
    connect(
      cnString,
      function(mdb,dbobj, err) {
        console.log(err);
        if (!err) {
          var collection = mdb.collection(tbl);
          if (selector === null || selector === undefined) {
            collection.find(query).toArray(function(err, docs) {
              dbobj.close();
              if (!err) {
                dbobj.close();
                callback(docs, null);
              } else {
                dbobj.close();
                callback(null, err);
              }
            });
          } else {
            collection.find(query, selector).toArray(function(err, docs) {
              dbobj.close();
              if (!err) {
                callback(docs, null);
              } else {
                dbobj.close();
                callback(null, err);
              }
            });
          }
        }else{
          dbobj.close();
        }
      }
    );
  } catch (ex) {
    console.log(ex,'try catch error connection not closed..')
    callback(null, ex);
  }
};

var rcallback = function(err, docs) {
  if (!err) {
    callback(docs, null);
  } else {
    callback(null, err);
  }
};

module.exports.findDocumentWT = function(
  cnString,
  tbl,
  query,
  options,
  callback
) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tbl);
          collection.findOne(query, function(err, docs) {
            dbobj.close();
            if (!err) {
              var res = {
                tableName: tbl,
                result: docs
              };
              callback(res, null);
            } else {
              dbobj.close();
              callback(null, err);
            }
          });
        }else{
          dbobj.close();
        }
      }
    );
  } catch (ex) {
    console.log(ex,'connection not closed..')
    callback(null, ex);
  }
};

module.exports.findDocument = function(cnString, tbl, query, callback) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tbl);
          collection.findOne(query, function(err, docs) {
            // db.close();
            dbobj.close();
            if (!err) {
              callback(docs, null);
            } else {
              dbobj.close();
              callback(null, err);
            }
          });
        } else {
          dbobj.close();
          callback(null, err);
        }
      }
    );
  } catch (ex) {
    console.log(ex,'connection not closed..')
    callback(null, ex);
  }
};

module.exports.removeDocument = function(cnString, tbl, query, callback) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tbl);
          collection.remove(query, function(err, docs) {
            // db.close();
            dbobj.close();
            if (!err) {
              callback(docs, null);
            } else {
              dbobj.close();
              callback(null, err);
            }
          });
        } else {
          dbobj.close();
          callback(null, err);
        }
      }
    );
  } catch (ex) {
    console.log(ex,'connection not clsed')
    callback(null, ex);
  }
};

module.exports.distinct = function(cnString, tbl, query, callback) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tbl);
          collection.distinct(query, function(err, docs) {   
            dbobj.close();         
            callback(docs, err);
          });
        } else {
          dbobj.close();         
          callback(null, err);
        }
      }
    );
  } catch (ex) {
    console.log(ex,'connection not closed..')
    callback(null, ex);
  }
};

module.exports.getCount = function(cnString, tbl, query, callback) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tbl);
          collection.count(query, function(err, count) {
            dbobj.close();
            callback(count, err);
          });
        }else{
          dbobj.close();
        }
      }
    );
  } catch (ex) {
    console.log(ex,'connection not closed..')
    callback(null, ex);
  }
};
module.exports.aggregate = function(cnString, tbl, query, callback, selector) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tbl);
          //console.log(tbl,'table name')
          collection.aggregate(query,{
                       allowDiskUse: true
                     }).toArray(function(err, docs) {
            dbobj.close();
            if (!err) {
              callback(docs, null);
            } else {
              dbobj.close();
              callback(null, err);
            }
          });
        }else{
          dbobj.close();
        }
      }
    );
  } catch (ex) {
    console.log(ex,'connection  not closed..')
    callback(null, ex);
  }
};
module.exports.sort = function(cnString, tbl, query,pageNum, callback, selector) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tbl);
          var itemsPerPage = 5;
          var skip_ = (itemsPerPage * (pageNum-1));
          collection.find(query).sort({"_id":1}).skip(skip_).limit(itemsPerPage).toArray(function(err, docs) {
            dbobj.close();  
            if (!err) {
              callback(docs, null);
            } else {
              callback(null, err);
            }
          });
        }else{
          dbobj.close();
        }
      }
    );
  } catch (ex) {
    console.log(ex,'connection not closed..')
    callback(null, ex);
  }
};

module.exports.newpushDocument = function(
  cnString,
  tabl,
  data,
  callback,
  keyIdentifier
) {
  "use strict";
  try {
    connect(
      cnString,
      function(db,dbobj, err) {
        if (!err) {
          var collection = db.collection(tabl);
          if (keyIdentifier) {
            var id = keyIdentifier;
            var q = {};
            q[id] = data[id];
            console.log(q);
            collection.replaceOne(
              q,
              data,
              {
                upsert: true
              },
              function(err, result) {
                //console.log(err, result);
                dbobj.close();
                if (!err) {
                  callback(result, null);
                } else {
                  dbobj.close();
                  callback(null, err);
                }
              }
            );
          } else {
            var id = new ObjectId(data._id);
            delete data._id;
            collection.update(
              {
                _id: id
              },
             {$push:{"search_array":data.search_array[0]}} ,
              function(err, result) {
                //db.close();
                if (!err) {
                  callback(result, null);
                } else {
                  dbobj.close();
                  callback(null, err);
                }
              }
            );
          }
        } else {
          dbobj.close();
          callback(null, err);
        }
      }
    );
  } catch (ex) {
    console.log(ex, 'connection not closed..')
    callback(null, ex);
  }
};