var restler = require('restler');

exports.publishLap = function(lap, trackId, access_token, cb) {
  var postData = {
    lap: lap,
    place: trackId,
    access_token: access_token
  }

  restler.post('https://graph.facebook.com/me/fblaptimer:drive',
    {
      data: postData
    }
  ).on('complete', function(data) {
    cb(JSON.parse(data));
  });
};
