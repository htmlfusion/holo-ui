function Calibration(scene, stereoCamera) {

  var scene = scene,
    camera = stereoCamera,
    loaded = false,
    object,
    target,
    cornerIndex=0,
    cornerMarker,
    globalCorners,
    displayTimeout;

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
    globalCorners = points;


    // material
    var material = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture('img/target-red.png'),
      transparent: true
    });
              
    // target
    target = new THREE.Mesh(new THREE.PlaneGeometry(5, 5, 5), material);
    scene.add(target);

    // material
    var blue = new THREE.MeshLambertMaterial({
      color: 'blue'
    });
              
    // target
    cornerMarker = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), blue);
    this.setupControls();

    loaded = true;

  };

  this.flashCorner = function(){
    scene.add(cornerMarker);

    if(displayTimeout){
      window.clearTimeout(displayOut);
    }

    displayTimeout = setTimeout(function(){
      scene.remove(cornerMarker);
      displayTimeout = null;
    }, 2000)

  };

  this.nextCorner = function(){
    cornerIndex++;
    var currentCorner = globalCorners[cornerIndex];
    cornerMarker.position.set(currentCorner[0],currentCorner[1],currentCorner[2]);
    this.flashCorner();
  }

  this.prevCorner = function(){
    cornerIndex--;
    var currentCorner = globalCorners[cornerIndex];
    cornerMarker.position.set(currentCorner[0],currentCorner[1],currentCorner[2]);
    this.flashCorner();
  }

  this.placeTarget = function(){
    target.position.x = (Math.random() * stereoCamera.screen.width)
      - stereoCamera.screen.width * .5;
    target.position.y = (Math.random() * stereoCamera.screen.height)
      - stereoCamera.screen.height * .5;
  };


  this.setupControls = function(){

    // next corner
    Mousetrap.bind('n', function(){
      this.nextCorner();
    }.bind(this));

    // previous corner 
    Mousetrap.bind('p', function(){
      this.prevCorner();
    }.bind(this));

    // place target
    Mousetrap.bind('t', function(){
      this.placeTarget();
    }.bind(this));

    // project ray
    Mousetrap.bind('space', function(){
      console.log('Bang');
    }.bind(this));


  };

  this.animate = function(){
    if(loaded){
      console.log(camera);
    }
  }.bind(this);

  if (scene.name === 'Calibration') {
    this.load();
  };


}