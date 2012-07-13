var db = require('./lib/db');
var og = require('./lib/og');
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
    if (req.params.lap) {
      db.Laps.getLap(req.params.lap, function(lap) {
        if (lap) {
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
	} else {
	  res.send('Lap not found', 404);
	}
      });
    } else {
      res.send('Lap not found', 404);
    }
  });

  app.post('/laps', function(req, res) {
    if (req.body.lap) {
      var lap = JSON.parse(req.body.lap);
      var start = req.body.start;
      var end = req.body.end;
      var track = tracks[lap.track];
      
      db.Laps.insertLap(lap, function(lap) {
        if (lap) {
          var lapURI = resources.getLapURI(req, lap._id);
          if (req.body.access_token) {
	    if (start && end) {
	      og.publishPastLap(lapURI, track.fbid, start, end, req.body.access_token,
	        function(id) {
	          console.log(id);
	      });
	    } else {
	      og.publishLap(lapUTI, track.fbid, req.body.access_token,
	        function(id) {
		  console.log(id);
	      });
	    }
	  }

          res.json(lapURI);
	} else {
	  res.send('Unable to add lap', 500);
	}
      });
    } else {
      res.send('No lap submitted', 400);
    }
  });

  //other routes..
}
