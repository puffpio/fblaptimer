var restler = require('restler');

exports.publishLap = function(lap, trackId, start, end, access_token, cb) {
  var postData = {
    lap: lap,
    place: trackId,
    start_time: start,
    end_time: end,
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
