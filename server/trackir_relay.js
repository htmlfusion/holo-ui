var dgram = require('dgram');
var server = dgram.createSocket('udp4');

// Listen for emission of the 'message' event.
server.on('message', function (message) {
	//console.log('received a message: ' + message);
	var split = message.toString().split(/\s+/);
	var numbers = [];
	split.forEach(function(val){
		var num = parseFloat(val);
		if (!isNaN(num)){
			numbers.push(num);
		}
	});
	console.log(numbers);
});

server.on('listening', function () {
    var address = server.address();
    console.log('I am listening on ' + 
        address.address + ':' + address.port);
});

server.on('error', function (e) {
	console.log('error', e);
});


// Bind to port 4000
var port = 4000;
server.bind(port, '0.0.0.0');

