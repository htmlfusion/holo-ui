#!/usr/bin/env node

var net = require('net');
var ws = require("nodejs-websocket")
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

var client = net.connect({port: 5000},
  function() { //'connect' listener
  console.log('connected to server!');
});
  
client.on('end', function() {
  console.log('disconnected from server');
});

var lastMessage = null;

client.on('data', function(message) {
  message = message.toString();
  if(message === lastMessage){
    return;
  }
  console.log('lastMessage', lastMessage);
  lastMessage = message;
  var split = message.split(/\s+/);
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
  
