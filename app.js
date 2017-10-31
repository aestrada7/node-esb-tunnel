const express = require('express');
const HttpsProxyAgent = require('https-proxy-agent');
const request = require('request');
const app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var port = process.env.PORT || 3000;
var proxy = process.env.PROXY || '';
var proxyAgent;

if(proxy) {
  proxyAgent = new HttpsProxyAgent(proxy);
}

app.get('/', function(req, res) {
  var serviceURL = process.env.SERVICE_URL;
  var serviceMethod = process.env.SERVICE_METHOD || 'POST';
  var url = 'http://localhost:81/TestServlet/retrieveContactDetail?kind=mock';
  var output = '';
  var userId = req.query.id || '429049';

  url = serviceURL || url;
  output += 'Sending "' + serviceMethod + '" request to URL: ' + url + ' (uid: ' + userId + ')';

  var options = {
    url: url,
    method: serviceMethod,
    body: '{"restContextHeader":{"applicativeContext":{"languageISOCode":"EN"}},"authorizationCriteria":{"intermediaryCode":"N/A"}}',
    timeout: 5000,
    headers: {},
    agent: proxyAgent
  };

  options.headers['ONEWEB-USERID'] = userId;
  options.headers['ONEWEB-GROUP'] = 'BP_EH_MNG,BP_EH_ADMIN,BP_TECH_PRINT';
  options.headers['x-eh-transactionID'] = 'BP';

  console.log(output);

  request(options, function(error, response, body) {
    if(!error) {
      console.log('Success!');
      res.send(body);      
    } else {
      console.log('Failure :(');
      res.send(error);
    }
  });
});

app.listen(port, function() {
  console.log('Listening on port ' + port);
});