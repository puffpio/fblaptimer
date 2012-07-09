var db = require('./lib/db');
var resources = require('./lib/resources');
var tracks = require('./data/tracks').Tracks;

function renderOr404(res, isRoute, errorMessage, cb) {
  if (isRoute) {
    cb();
  } else {
    res.send(errorMessage, 404);
  }
}

function listLap(lc, req, res) {
  console.log('foo');
}

module.exports = function(app){
  app.get('/tracks/:track', function(req, res){
    // if a track is supplied and exists
    renderOr404(res,
      req.params.track && tracks[req.params.track],
      'Track not found',
      function() {
        var track = tracks[req.params.track];
        var og_url = resources.getTrackURI(req, req.params.track);
        var og_image = resources.getImageURI(req, track.image);

        res.render('track.ejs', {	  
          layout: false,
          app_id: process.env.FACEBOOK_APP_ID,
          og_url: og_url,
          og_image: og_image,
          track: track
        });
     });
  });

  app.get('/laps/:lap', function(req, res) {
    db.getLapsCollection(function(lc) {
      // if a lap is supplied and exists
      renderOr404(res,
        req.params.lap && true, // change this later
        'Lap not found',
        function() {
          var lap = {
            name: 'foo',
	    description: 'bar',
	    time: 1,
	    top_speed: 2,
	    track: 'thunderhill',
	    coordinates: [
	      { latitude: 39.543820, longitude: -122.328909 },
	      { latitude: 39.544581, longitude: -122.329832 }
	    ]
	  };

	  var og_url = resources.getLapURI(req, req.params.lap);
	  var og_image = resources.getImageURI(req, tracks[lap.track].image);
	  var track_url = resources.getTrackURI(req, lap.track);

          res.render('lap.ejs', {
            layout: false,
	    app_id: process.env.FACEBOOK_APP_ID,
	    og_url: og_url,
	    og_image: og_image,
            lap: lap,
	    track_url: track_url
	  });
      });
    });
  });

  //other routes..
}
