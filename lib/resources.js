function host(req) {
  return req.headers['host'];
}

function scheme(req) {
  return (req.headers['x-forwarded-proto'] || 'http');
}

function baseURI(req) {
  return scheme(req) + '://' + host(req);
}

exports.getImagePath = function(req, image) {
  return baseURI(req) + '/images/' + image;
}
