var mongo = require('mongodb');

var database = null;
var lapsCollection = null;

function getDB(cb) {
  if (database) {
    cb(database);
  } else {
    mongo.connect(process.env.MONGOLAB_URI, {}, function(error, db) {
      database = db;
      cb(db);
    });
  }
}

exports.getLapsCollection = function(cb) {
  if (lapsCollection) {
    cb(lapsCollection);
  } else {
    getDB(function(db) {
      db.collection('laps', function(error, collection) {
	lapsCollection = collection;
        cb(collection);
      });
    });
  }
}
