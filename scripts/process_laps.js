var csv = require('csv');

var tracks = require('../data/tracks').Tracks;

if (process.argv.length != 3) {
 console.log('Missing input file parameter');
} else {
  var input = process.argv[2];
  var lap = {
    name: '',
    description: '',
    time: 0,
    top_speed: 0,
    track: 'thunderhill',
    coordinates: []
  };
  var lapDate;
  var lapTime;

  csv()
    .fromPath(__dirname + '/' + input, { columns: true })
    .on('data', function(data, index) {
      lapDate = data['time='];
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

      console.log(lap);
      console.log(lapDate);
    });
}
