function host(req) {
  return req.headers['host'];
}

function scheme(req) {
  return (req.headers['x-forwarded-proto'] || 'http');
}

function baseURI(req) {
  return scheme(req) + '://' + host(req);
}

exports.getImageURI = function(req, image) {
  return baseURI(req) + '/images/' + image;
}

exports.getTrackURI = function (req, track) {
  return baseURI(req) + '/track/' + track;
}