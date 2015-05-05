function Calibration(scene, stereoCamera) {

  var scene = scene,
    camera = stereoCamera,
    loaded = false,
    object;

  this.load = function() {
    var indexes = [1, 4, 0, 5, 3, 6];
    object = scene.getChildByName('calibrationTarget')
    object.updateMatrixWorld();
    var points = [];
    for (var i = 0; i < 8; i++) {
      var vector = object.geometry.vertices[i].clone();
      vector.applyMatrix4(object.matrixWorld);
      points.push([vector.x, vector.y, vector.z]);
    }
    console.log(JSON.stringify({
      box: points
    }));

  };

  this.animate = function(){
    if(loaded){
      console.log(camera);
    }
  };

  if (scene.name === 'Calibration') {
    this.load();
  };


}