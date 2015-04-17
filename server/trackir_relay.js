var ws = require("nodejs-websocket")
var dgram = require('dgram');
var subscribed = [];

var websocketServer = ws.createServer(function(conn) {
  conn.on("close", function(code, reason) {
    console.log("Connection closed")
    subscribed = [];
  })
  conn.on("text", function(str) {
    if (str === 'subscribe') {
      subscribed.push(conn);
      return
    }
  })

}).listen(8887);

var server = dgram.createSocket('udp4');
// Listen for emission of the 'message' event.
server.on('message', function(message) {
  console.log('received a message: ' + message);
  var split = message.toString().split(/\s+/);
  var numbers = [];
  split.forEach(function(val) {
    var num = parseFloat(val);
    if (!isNaN(num)) {
      numbers.push(num);
    }
  });
  var body = {
    head: {x: numbers[3], y: numbers[4], z: numbers[5]}
  };
  console.log(body);
  subscribed.forEach(function(c) {
    c.sendText(JSON.stringify(body));
  });

});

server.on('listening', function() {
  var address = server.address();
  console.log('I am listening on ' +
    address.address + ':' + address.port);
});

server.on('error', function(e) {
  console.log('error', e);
});


// Bind to port 6543
var port = 6543;
server.bind(port, '0.0.0.0');