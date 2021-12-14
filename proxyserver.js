const express = require('express');
const proxy = require('http-proxy-middleware');
var path = require('path');

const app = express();
app.use(express.static('client'));

// Add middleware for http proxying 
//const apiProxy = proxy('/api', { target: 'https://www.arivpaysystem.com:5000' });
//app.use('/', apiProxy);

app.use(express.static(path.join(__dirname, 'dist')));

// app.use('/node_modules', express.static(path.join(__dirname + '/node_modules')));


app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});


app.listen(4400, () => {
  console.log('Listening on: http://localhost:4400');
});
