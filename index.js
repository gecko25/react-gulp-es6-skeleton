//This is where you load express,
//load your routes, load the database,
//and start your server.

//This index file should implement configurations set
//in server/config/

var express = require('express');
var app = express();

var port = 5001;

app.use(express.static(__dirname + '/public/dist'));

app.listen(port, function(){
    console.log('Started up! Listening on port:' + port)
});
