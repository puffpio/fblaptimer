var csv = require('csv');
var restler = require('restler');
var tracks = require('../data/tracks').Tracks;

if (process.argv.length != 4) {
 console.log('Missing input file parameter or access token');
} else {
  var input = process.argv[2];
  var access_token = process.argv[3];
  var lap = {
    name: '',
    description: '',
    time: 0,
    top_speed: 0,
    track: 'thunderhill',
    coordinates: []
  };
  var startDate;
  var endDate;
  var lapTime;
  var count = 0;

  csv()
    .fromPath(__dirname + '/' + input, { columns: true })
    .on('data', function(data, index) {
      if (count === 0) { 
	startDate = data['time='];
	count++;
      }
      endDate = data['time='];
      lapTime = data['elapsed time='];
      
      var speed = parseFloat(data['speed=']);
      if (lap.top_speed < speed) { lap.top_speed = speed; }
      lap.coordinates.push(
        {
	  latitude: parseFloat(data['latitude=']),
	  longitude: parseFloat(data['longitude='])
	}
      );
    })
    .on('end', function(count) {
      lap.name = lapTime + ' at ' + tracks[lap.track].name;
      lap.description = "Top speed of " + lap.top_speed + ' mph';

      var minuteSplit = lapTime.split(':'); // split minutes
      if (minuteSplit.length == 2) { // there are minutes
        lap.time += parseInt(minuteSplit[0]) * 60;
	lapTime = minuteSplit[1];
      }
      lap.time += parseFloat(lapTime);

      var postData = {
        lap: JSON.stringify(lap),
	start: startDate,
	end: endDate,
	access_token: access_token
      };

      restler.post('https://fblaptimer.herokuapp.com/laps', { data: postData })
        .on('complete', function(data) {
          console.log(data);
      });
    });
}
