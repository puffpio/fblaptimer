var restler = require('restler');

exports.publishLap = function(lap, access_token, cb) {
  var postData = {
    lap: lap,
    access_token: access_token
  }

  restler.post('https://graph.facebook.com/me/fblaptimer:drive',
    { data: postData }
  ).on('complete', function(data) {
    cb(JSON.parse(data));
  });
};
