var express = require('express');
var bodyparser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');

var app = express();

mongoose.connect(config.database, function(err) {
  if(err) {
    console.log('Error connect');
  } else {
    console.log('Connceted');
  }
});

app.use(bodyparser.urlencoded({ extended : true}));
app.use(bodyparser.json());
app.use(morgan('dev'));

var Api = require('./app/routes/api')(app, express);
app.use('/api', Api);

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

var port = config.port;
app.listen(port, function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log("Remarks on "+port);
  }
});
