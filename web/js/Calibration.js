function Calibration(scene, stereoCamera) {

  var scene = scene,
    camera = stereoCamera,
    debugCamera = scene.getChildByName('cameraDebug'),
    loaded = false,
    object,
    target,
    cornerIndex = 0,
    cornerMarker,
    debugMarkers = [],
    globalCorners,
    displayTimeout,
    cornerCalib = {},
    verticalOffset = 0;

  function pairwise(list) {
    if (list.length < 2) { return []; }
    var first = list[0],
      rest  = list.slice(1),
      pairs = rest.map(function (x) { return [first, x]; });
    return pairs.concat(pairwise(rest));
  }


  this.load = function() {
    object = scene.getChildByName('calibrationTarget')
    object.updateMatrixWorld();
    var points = [];
    for (var i = 0; i < 8; i++) {
      var vector = object.geometry.vertices[i].clone();
      vector.applyMatrix4(object.matrixWorld);
      points.push([vector.x, vector.y, vector.z]);
      cornerCalib[i] = {
        lines: [],
        points: []
      };
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
    cornerMarker = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10), blue);
    this.setupControls();

    loaded = true;

  };

  this.flashCorner = function() {
    scene.add(cornerMarker);

    if (displayTimeout) {
      window.clearTimeout(displayOut);
    }

    displayTimeout = setTimeout(function() {
      scene.remove(cornerMarker);
      displayTimeout = null;
    }, 2000)

  };

  this.nextCorner = function() {
    cornerIndex++;
    var currentCorner = globalCorners[cornerIndex];
    cornerMarker.position.set(currentCorner[0], currentCorner[1], currentCorner[2]);
    this.flashCorner();
  }

  this.prevCorner = function() {
    cornerIndex--;
    var currentCorner = globalCorners[cornerIndex];
    cornerMarker.position.set(currentCorner[0], currentCorner[1], currentCorner[2]);
    this.flashCorner();
  }

  this.placeTarget = function() {
    target.position.x = (Math.random() * stereoCamera.screen.width) - stereoCamera.screen.width * .5;
    target.position.y = (Math.random() * stereoCamera.screen.height) - stereoCamera.screen.height * .5;
  };


  this.setupControls = function() {

    // show corners
    Mousetrap.bind('s', function() {

      var points = [];
      for(var i=0; i<8; i++){
        if (cornerCalib[i].points.length){

          var p = mathjs.divide(cornerCalib[i].points.reduce(function(a,b){
              return mathjs.add(a, b);
            }), cornerCalib[i].points.length);


          cornerCalib[i].points.forEach(function(p){

            var red = new THREE.MeshLambertMaterial({
              color: 'green'
            });

            // target
            marker = new THREE.Mesh(new THREE.SphereGeometry(.5, 10, 10), red);
            marker.position.set(p[0], p[1], p[2]);
            debugMarkers.push(marker);
            scene.add(marker);

          });

          // material
          var red = new THREE.MeshLambertMaterial({
            color: 'red'
          });

          // target
          marker = new THREE.Mesh(new THREE.SphereGeometry(.5, 10, 10), red);
          marker.position.set(p[0], p[1], p[2]);
          debugMarkers.push(marker);
          scene.add(marker);
        }
      }

    }.bind(this));


    this.calibrate = function(){

      for(var i=0; i<8; i++){

        var lines = cornerCalib[i].lines;

        var combinations = pairwise(lines);
        var points = []

        combinations.forEach(function(pair){

          var lineA = JSON.parse(JSON.stringify(pair[0]));
          var lineB = JSON.parse(JSON.stringify(pair[1]));

          lineA[1][1] += verticalOffset;
          lineB[1][1] += verticalOffset;

          var closest = closestDistanceBetweenLines(lineA[0], lineA[1], lineB[0], lineB[1]);
          var center = mathjs.divide(mathjs.add(closest[0], closest[1]), 2);
          points.push(center);
        });

        cornerCalib[i].points = points;
      }
    };

    // hide corners
    Mousetrap.bind('h', function() {

      debugMarkers.forEach(function(m){
        scene.remove(m);
      });

    }.bind(this));

    // next corner
    Mousetrap.bind('n', function() {
      this.nextCorner();
    }.bind(this));

    // previous corner
    Mousetrap.bind('p', function() {
      this.prevCorner();
    }.bind(this));

    // place target
    Mousetrap.bind('t', function() {
      this.placeTarget();
    }.bind(this));

    // project ray
    Mousetrap.bind('space', function() {
      console.log('Bang');
      var cameraPos = stereoCamera.group.position.toArray();
      cameraPos[0] += stereoCamera.renderCamR.position.x;
      //var cameraPos = debugCamera.position.toArray();

      var line = [target.position.clone().toArray(),
        cameraPos];

      //if( cornerCalib[cornerIndex].lines.length > 0){
      //  var lines = cornerCalib[cornerIndex].lines;
      //  lines.forEach(function(l){
      //    var closest = closestDistanceBetweenLines(l[0], l[1], line[0], line[1]);
      //    var center = mathjs.divide(mathjs.add(closest[0], closest[1]), 2);
      //    cornerCalib[cornerIndex].points.push(center);
      //  });
      //}

      cornerCalib[cornerIndex].lines.push(line)

    }.bind(this));


    Mousetrap.bind('up', function(){
      var incr = .1;
      //verticalOffset += incr;
      stereoCamera.verticalOffset += incr;
      this.calibrate();
    }.bind(this));

    Mousetrap.bind('down', function(){
      var incr = .1;
      //verticalOffset -= incr;
      stereoCamera.verticalOffset -= incr;
      this.calibrate();
    }.bind(this));

    //Rotate up
    Mousetrap.bind('i', function(){
      var incr = .1;
      stereoCamera.xRotationOffset += incr;
    }.bind(this));

    //Rotate down
    Mousetrap.bind('k', function(){
      var incr = .1;
      stereoCamera.xRotationOffset -= incr;
    }.bind(this));

    //Rotate left
    Mousetrap.bind('j', function(){
      var incr = .1;
      stereoCamera.yRotationOffset += incr;
    }.bind(this));

    //Rotate right
    Mousetrap.bind('l', function(){
      var incr = .1;
      stereoCamera.yRotationOffset -= incr;
    }.bind(this));

  };

  this.animate = function() {
    if (loaded) {
    }
  }.bind(this);

  if (scene.name === 'Calibration') {
    this.load();
  };


}


var closestDistanceBetweenLines = function(a0, a1, b0, b1, clampAll, clampA0, clampA1, clampB0, clampB1) {
  // http://stackoverflow.com/a/28701387/196048
  // Given two lines defined by numpy.array pairs (a0,a1,b0,b1)
  // Return distance, the two closest points, and their average

  clampA0 = clampA0 || false;
  clampA1 = clampA1 || false;
  clampB0 = clampB0 || false;
  clampB1 = clampB1 || false;
  clampAll = clampAll || false;

  if (clampAll) {
    clampA0 = true;
    clampA1 = true;
    clampB0 = true;
    clampB1 = true;
  }

  //Calculate denomitator
  var A = math.subtract(a1, a0);
  var B = math.subtract(b1, b0);
  var _A = math.divide(A, math.norm(A))
  var _B = math.divide(B, math.norm(B))
  var cross = math.cross(_A, _B);
  var denom = math.pow(math.norm(cross), 2);

  //If denominator is 0, lines are parallel: Calculate distance with a projection and evaluate clamp edge cases
  if (denom == 0) {
    var d0 = math.dot(_A, math.subtract(b0, a0));
    var d = math.norm(math.subtract(math.add(math.multiply(d0, _A), a0), b0));

    //If clamping: the only time we'll get closest points will be when lines don't overlap at all. Find if segments overlap using dot products.
    if (clampA0 || clampA1 || clampB0 || clampB1) {
      var d1 = math.dot(_A, math.subtract(b1, a0));

      //Is segment B before A?
      if (d0 <= 0 && 0 >= d1) {
        if (clampA0 == true && clampB1 == true) {
          if (math.absolute(d0) < math.absolute(d1)) {
            return [b0, a0, math.norm(math.subtract(b0, a0))];
          }
          return [b1, a0, math.norm(math.subtract(b1, a0))];
        }
      }
      //Is segment B after A?
      else if (d0 >= math.norm(A) && math.norm(A) <= d1) {
        if (clampA1 == true && clampB0 == true) {
          if (math.absolute(d0) < math.absolute(d1)) {
            return [b0, a1, math.norm(math.subtract(b0, a1))];
          }
          return [b1, a1, math.norm(math.subtract(b1, a1))];
        }
      }

    }

    //If clamping is off, or segments overlapped, we have infinite results, just return position.
    return [null, null, d];
  }

  //Lines criss-cross: Calculate the dereminent and return points
  var t = math.subtract(b0, a0);
  var det0 = math.det([t, _B, cross]);
  var det1 = math.det([t, _A, cross]);

  var t0 = math.divide(det0, denom);
  var t1 = math.divide(det1, denom);

  var pA = math.add(a0, math.multiply(_A, t0));
  var pB = math.add(b0, math.multiply(_B, t1));

  //Clamp results to line segments if needed
  if (clampA0 || clampA1 || clampB0 || clampB1) {

    if (t0 < 0 && clampA0)
      pA = a0;
    else if (t0 > math.norm(A) && clampA1)
      pA = a1;

    if (t1 < 0 && clampB0)
      pB = b0;
    else if (t1 > math.norm(B) && clampB1)
      pB = b1;

  }

  var d = math.norm(math.subtract(pA, pB))

  return [pA, pB, d];
}
