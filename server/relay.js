var ws = require("nodejs-websocket")
var fs = require('fs');

var subscribed = [];
// Scream server example: "hi" -> "HI!!!" 
var server = ws.createServer(function(conn) {
  console.log("New connection")
  conn.on("text", function(str) {
    if (str === 'subscribe') {
      subscribed.push(conn);
      return
    }
    var pos = JSON.parse(str);
    var body = {head: pos};
    console.log(body);
    subscribed.forEach(function(c) {
      c.sendText(JSON.stringify(body));
    });
  })
  conn.on("close", function(code, reason) {
    console.log("Connection closed")
    subscribed = [];
  })
}).listen(8887)