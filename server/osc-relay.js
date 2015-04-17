var osc = require('node-osc');
var ws = require("nodejs-websocket")

var oscServer = new osc.Server(3333, '127.0.0.1');
var server = ws.createServer(function(conn) {
  console.log("New connection")
  
  oscServer.on("message", function (msg, rinfo) {
    console.log("TUIO message:");
    console.log(msg);
    subscribed.forEach(function(c) {
      c.sendText(JSON.stringify(body));
    });
  });

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

