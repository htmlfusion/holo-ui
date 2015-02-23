function Calibration(scene) {
  var scene = scene;
  var object;

  this.load = function() {
  	object = scene.getChildByName('Box 1')
  	object.updateMatrixWorld();
  	var points = [];
  	for(var i=0; i<8; i++){
  		var vector = object.geometry.vertices[i].clone();
  		vector.applyMatrix4( object.matrixWorld );
  		points.push([vector.x, vector.y, vector.z]);
  	}
  	console.log(JSON.stringify({box: points}));
  }

  if (scene.name === 'Calibration') {
    this.load();
  }

}