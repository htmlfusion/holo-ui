'use strict';


function StereoCamera(renderer, scene, group) {

  var self = this;

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
  var transform = new THREE.Matrix4();
  transform.set(1.0767210688730582, -0.0224848567940982, 0.03825194115293704, -3.8477102953334557, 0.030423768295330025, 1.05036714077187, -0.2389566986958065, 53.64223320912849, -0.03229820598316467, 0.2398339857981666, 1.0501111965352017, -75.8564358689001, 0.0, 0.0, 0.0, 1.0);
  // group.matrixAutoUpdate = false;
  // group.updateMatrix();

  //self.offset = new THREE.Matrix4();
  self.offset = transform;
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

  var pos = this.offset.applyToVector3Array([-position[0]/10, position[1]/10, position[2]/10]);
  // group.rotation.x = 0;
  // group.rotation.y = 0;
  // group.rotation.z = 0;

  // group.scale.x = 1;
  // group.scale.y = 1;
  // group.scale.z = 1;



  group.position.x = pos[0];
  group.position.y = pos[1];
  group.position.z = pos[2];
  // if (this.offset) {
  //   group.updateMatrix();
  //   //var newMat = new THREE.Matrix4();
  //   //newMat.multiplyMatrices(self.offset, group.matrix);
  //   //group.applyMatrix(newMat);
  //   group.matrixWorld = self.offset;
  //   group.updateMatrix();
  // }
};

self.updateHelpers = function() {
  camHelperL.update();
  camHelperR.update();
}


self.updateFrustum = function(screenOpts) {
  var vectorL = group.position.clone();
  // scene.updateMatrixWorld();
  // group.updateMatrixWorld();
  // renderCamL.updateMatrixWorld();
  // renderCamR.updateMatrixWorld();

  // var vectorL = new THREE.Vector3();
  // vectorL.setFromMatrixPosition(renderCamL.matrixWorld);
  vectorL.x -= 3;

  var near = 10;

  var width = screenOpts.width;
  var pxSize = pxWidth / width;;
  var height = screenOpts.height;

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

self.render = function(screenOpts) {

  self.updateFrustum(screenOpts);
  renderer.clear();
  renderer.enableScissorTest(true);

  renderer.setScissor(0, 0, pxWidth / 2, pxHeight);
  renderer.setViewport(0, 0, pxWidth / 2, pxHeight);
  renderer.render(scene, renderCamL);

  renderer.setScissor(pxWidth / 2, 0, pxWidth / 2, pxHeight);
  renderer.setViewport(pxWidth / 2, 0, pxWidth / 2, pxHeight);
  renderer.render(scene, renderCamR);

  renderer.enableScissorTest(false);

};

};