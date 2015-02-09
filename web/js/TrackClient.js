'use strict';

function TrackCLient(){
  
  var self=this;
  var wsUri = 'ws://127.0.0.1:9001/ws';
  
  self.websocket = new WebSocket(wsUri); 
  
  self.websocket.onopen = function(evt) {
    self.websocket.send('subscribe');
  }; 
  
  self.websocket.onmessage = function (evt) {
    console.log(evt.data);
  };  
  
}