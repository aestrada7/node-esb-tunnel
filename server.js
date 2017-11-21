const express = require('express');
const HttpsProxyAgent = require('https-proxy-agent');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var port = process.env.PORT || 3000;
var proxy = process.env.PROXY || '';
var proxyAgent;

if(proxy) {
  proxyAgent = new HttpsProxyAgent(proxy);
}

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

var rawBody = function(req, res, next) {
  req.setEncoding('utf-8');
  req.rawBody = '';
  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });
  req.on('end', function() {
    next();
  });
};

app.use(allowCrossDomain);
app.use(rawBody);

app.get('/endpoint/*', function(req, res) {
  tunnel(req, res, 'GET');
});

app.post('/endpoint/*', function(req, res) {
  tunnel(req, res, 'POST');
});

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

app.get('/environment.js', function(req, res) {
  if(process.env.APP_URL) {
    res.send('var APP_URL = ' + process.env.APP_URL + ';');
    console.log('Successfully retrieved environment variable APP_URL.');
  } else {
    res.send('var APP_URL = {};');
    console.log('Unable to retrieve environment variable APP_URL. Is it set on the Cloud Foundry settings?');
  }
});

app.use(express.static(path.join(__dirname, '/')));

var tunnel = function(req, res, method) {
  var baseURL = process.env.BASE_URL || 'http://localhost:81/TestServlet/';
  var serviceMethod = method || process.env.SERVICE_METHOD || 'POST';
  var url = '';
  var output = '';

  url = baseURL + req.url.split('/endpoint/').join('');

  var options = {
    url: url,
    method: serviceMethod,
    body: req.rawBody,
    timeout: 5000,
    headers: {},
    agent: proxyAgent
  };

  options.headers['ONEWEB-USERID'] = req.header('ONEWEB-USERID');
  options.headers['ONEWEB-GROUP'] = req.header('ONEWEB-GROUP');
  options.headers['x-eh-transactionID'] = req.header('x-eh-transactionID');

  output += 'Sending "' + serviceMethod + '" request to URL: ' + url;
  console.log(output);

  request(options, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      console.log('Success!');
      res.send(body);
    } else {
      console.log('Error: ' + response.statusCode + ' Failure :(');
      console.log(options.headers);
      output += '<br>Failed.'
      res.send(output);
    }
  });
};