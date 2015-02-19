var ws = require("nodejs-websocket")
var fs = require('fs');

var data = [];
var subscribed = [];
// Scream server example: "hi" -> "HI!!!" 
var server = ws.createServer(function (conn) {
    console.log("New connection")
    conn.on("text", function (str) {
			if(str==='subscribe'){
				subscribed.push(conn);
				return
			}
			var pos = JSON.parse(str);
			data.push(pos);
			var string = pos.x+','+pos.y+','+pos.z;
			console.log(string);
			subscribed.forEach(function(c){
				c.sendText(str);
			});
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
				subscribed=[];
         var outputFilename = '/tmp/my.json';
         
         fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
             if(err) {
               console.log(err);
             } else {
               console.log("JSON saved to " + outputFilename);
             }
         }); 
				
    })
}).listen(8887)

