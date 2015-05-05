'use strict';


function StereoCamera(renderer, scene, group, screen) {

  var self = this;

  this.screen = screen;

  var renderer = renderer;
  var scene = scene;
  var group = group;

  var renderCamL = group.getChildByName('cameraLeft');
  var renderCamR = group.getChildByName('cameraRight');

  var camHelperL = new THREE.CameraHelper(renderCamL);
  var camHelperR = new THREE.CameraHelper(renderCamR);

  var size = 500;
  var step = 50;
  var debug = false;

  var pxWidth = window.innerWidth;
  var pxHeight = window.innerHeight;

  var gridHelper = new THREE.GridHelper(size, step);

  function keydown(event) {
    // <d> key for debug cam
    if (event.keyCode === 97) {
      self.zOffset += 1;
    } else if (event.keyCode === 122) {
      self.zOffset -= 1;
    }
  }
  $(document).keypress(keydown);

  //group.applyMatrix(self.offset);

  //group.applyMatrix(this.offset);

  //self.setIO(8);

  self.debug = function(on) {
    debug = on;
    if (on) {
      scene.add(camHelperL);
      scene.add(camHelperR);
      scene.add(gridHelper);
    } else {
      scene.remove(camHelperL);
      scene.remove(camHelperR);
      scene.remove(gridHelper);
    }
  };

  self.setIO = function(distance) {
    renderCamL.position.x = -distance / 2;
    renderCamR.position.x = distance / 2;
  };

  self.setPosition = function(position) {
    var pos = [(position[0] / 10), (position[1] / 10) + 22.86, (position[2] / 10)];
    group.position.x = pos[0];
    group.position.y = pos[1];
    group.position.z = pos[2];
  };

  self.updateHelpers = function() {
    camHelperL.update();
    camHelperR.update();
  }


  self.updateFrustum = function() {
    var vectorL = group.position.clone();
    // scene.updateMatrixWorld();
    // group.updateMatrixWorld();
    // renderCamL.updateMatrixWorld();
    // renderCamR.updateMatrixWorld();

    // var vectorL = new THREE.Vector3();
    // vectorL.setFromMatrixPosition(renderCamL.matrixWorld);

    // interocular distance, 6cm between eyes
    vectorL.x -= 3;

    var near = 10;

    var width = this.screen.width;
    var height = this.screen.height;
    var pxSize = pxWidth / width;;

    var leftScreen = width / 2.0 + vectorL.x;
    var left = near / vectorL.z * leftScreen;

    var rightScreen = width / 2.0 - vectorL.x;
    var right = near / vectorL.z * rightScreen;

    var bottomScreen = -height / 2.0 - vectorL.y;
    var bottom = near / vectorL.z * bottomScreen;

    var topScreen = height / 2.0 - vectorL.y;
    var top = near / vectorL.z * topScreen;

    renderCamL.projectionMatrix.makeFrustum(-left, //left
      right, //right
      bottom, //bottom
      top, //top
      near,
      60000
    );

    var vectorR = group.position.clone();
    vectorR.x += 3;
    // var vectorR = new THREE.Vector3();
    // vectorR.setFromMatrixPosition(renderCamR.matrixWorld);

    var leftScreen = width / 2.0 + vectorR.x;
    var left = near / vectorL.z * leftScreen;

    var rightScreen = width / 2.0 - vectorR.x;
    var right = near / vectorL.z * rightScreen;

    var bottomScreen = -height / 2.0 - vectorR.y;
    var bottom = near / vectorR.z * bottomScreen;

    var topScreen = height / 2.0 - vectorR.y;
    var top = near / vectorR.z * topScreen;

    renderCamR.projectionMatrix.makeFrustum(-left, //left
      right, //right
      bottom, //bottom
      top, //top
      near,
      60000
    );


    renderCamR.aspect = (window.innerWidth / window.innerHeight) / 2;
    renderCamL.aspect = (window.innerWidth / window.innerHeight) / 2;
  }

  self.render = function() {

    self.updateFrustum();
    renderer.clear();

    renderer.setViewport(0, 0, pxWidth / 2, pxHeight);
    renderer.render(scene, renderCamL);

    renderer.enableScissorTest(true);

    renderer.setScissor(0, 0, pxWidth / 2, pxHeight);
    renderer.setViewport(0, 0, pxWidth / 2, pxHeight);
    renderer.render(scene, renderCamL);

    renderer.setScissor(pxWidth / 2, 0, pxWidth / 2, pxHeight);
    renderer.setViewport(pxWidth / 2, 0, pxWidth / 2, pxHeight);
    renderer.render(scene, renderCamR);
    renderer.setScissor(pxWidth / 2, 0, pxWidth / 2, pxHeight);
    renderer.setViewport(pxWidth / 2, 0, pxWidth / 2, pxHeight);

    renderer.enableScissorTest(false);

  };

};