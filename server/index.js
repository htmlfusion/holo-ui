var express = require('express');

var app = express();

app.use(express.static(__dirname+ '/../web'));

var server = app.listen(9000);

var io = require('socket.io')(server);
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

