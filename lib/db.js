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

function getLapsCollection(cb) {
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

exports.Laps = {
  getLap: function(id, cb) {
    getLapsCollection(function(lc) {
      lc.findOne({ _id: mongo.ObjectID.createFromHexString(id) },
        function(error, lap) {
          cb(lap);
      });
    });
  },

  insertLap: function(lap, cb) {
    getLapsCollection(function(lc) {
      lc.insert(lap, { safe: true }, function(error, records) {
        cb(records[0]);
      });
    });
  }
}
