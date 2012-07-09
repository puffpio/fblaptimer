var resources = require('./lib/resources');
var tracks = require('./data/tracks').Tracks;

module.exports = function(app){
  app.get('/tracks/:track', function(req, res){
    // if a track is supplied and exists
    if (req.params.track && tracks[req.params.track]) {
      var track = tracks[req.params.track];
      var og_url = resources.getTrackURI(req, req.params.track);
      var og_image = resources.getImageURI(req, track.image);

      res.render('track.ejs', {	  
        layout: false,
        app_id: process.env.FACEBOOK_APP_ID,
	og_url: og_url,
	og_image: og_image,
	track_id: req.params.track,
	track: track
      });
    } else {
      res.send('Track not found', 404);
    }
  });

  //other routes..
}
