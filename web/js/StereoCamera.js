'use strict';


function StereoCamera(renderer, scene, group, screen) {

  var self = this;

  this.screen = screen;

  var renderer = renderer;
  var scene = scene;
  this.group = group;

  this.renderCamL = this.group.getChildByName('cameraLeft');
  this.renderCamR = this.group.getChildByName('cameraRight');
  this.renderCamR.aspect = (window.innerWidth / window.innerHeight) / 2;
  this.renderCamL.aspect = (window.innerWidth / window.innerHeight) / 2;

  this.offset = {
    tx: 0,
    ty: 44.925,
    tz: 10,
    rx: 0,
    ry: 0,
    rz: 0
  }
  this.io = null;

  var camHelperL = new THREE.CameraHelper(this.renderCamL);
  var camHelperR = new THREE.CameraHelper(this.renderCamR);

  var size = 500;
  var step = 50;
  var debug = false;

  var pxWidth = window.innerWidth;
  var pxHeight = window.innerHeight;

  var gridHelper = new THREE.GridHelper(size, step);

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

    this.io = distance;
    this.renderCamL.position.x = -distance / 2;
    this.renderCamR.position.x = distance / 2;

  };

  self.setPosition = function(position) {

    // 34.925 is the camera's vertical offset
    var pos = [ 
      (position[0] / 10) + this.offset.tx, (position[1] / 10) + this.offset.ty, 
      (position[2] / 10) + this.offset.tz
    ];
    this.group.position.x = pos[0];
    this.group.position.y = pos[1];
    this.group.position.z = pos[2];

    var m = new THREE.Matrix4();
    var rx = new THREE.Matrix4();
    var ry = new THREE.Matrix4();

    rx.makeRotationX( this.offset.rx * Math.PI / 180 );
    ry.makeRotationY( this.offset.ry * Math.PI / 180 );

    m.multiplyMatrices( rx, ry );
    this.group.position.applyMatrix4(m);

  };

  self.updateHelpers = function() {

    camHelperL.update();
    camHelperR.update();

  };


  self.updateFrustum = function() {
    var vectorL = this.group.position.clone();
    // scene.updateMatrixWorld();
    // this.group.updateMatrixWorld();
    // this.renderCamL.updateMatrixWorld();
    // this.renderCamR.updateMatrixWorld();

    // var vectorL = new THREE.Vector3();
    // vectorL.setFromMatrixPosition(renderCamL.matrixWorld);

    // interocular distance, 6cm between eyes
    vectorL.x -= this.io/2;

    var near = 10;

    var width = this.screen.width;
    var height = this.screen.height;
    var aspect = width/height;
    var pxSize = pxWidth / width;;

    var scalr = 1; 

    var leftScreen = width / 2.0 + vectorL.x;
    var left = near / vectorL.z * leftScreen * scalr;

    var rightScreen = width / 2.0 - vectorL.x;
    var right = near / vectorL.z * rightScreen * scalr;

    var bottomScreen = - height / 2.0 - vectorL.y;
    var bottom = near / vectorL.z * bottomScreen;

    var topScreen = height / 2.0 - vectorL.y;
    var top = near / vectorL.z * topScreen;

    var far = 6000;

    this.renderCamL.projectionMatrix.makeFrustum(
      -left, //left
      right, //right
      bottom, //bottom
      top, //top
      near,
      far
    );

    var vectorR = this.group.position.clone();
    vectorR.x += this.io/2;
    // var vectorR = new THREE.Vector3();
    // vectorR.setFromMatrixPosition(renderCamR.matrixWorld);

    var leftScreen = width / 2.0 + vectorR.x;
    var left = near / vectorR.z * leftScreen * scalr;

    var rightScreen = width / 2.0 - vectorR.x;
    var right = near / vectorR.z * rightScreen * scalr;

    var bottomScreen = -height / 2.0 - vectorR.y;
    var bottom = near / vectorR.z * bottomScreen;

    var topScreen = height / 2.0 - vectorR.y;
    var top = near / vectorR.z * topScreen;

    this.renderCamR.projectionMatrix.makeFrustum(
      -left, //left
      right, //right
      bottom, //bottom
      top, //top
      near,
      far
    );




  };

  self.render = function() {

    self.updateFrustum();
    renderer.clear();

    renderer.setViewport(0, 0, pxWidth / 2, pxHeight);
    renderer.render(scene, this.renderCamL);

    renderer.enableScissorTest(true);

    renderer.setScissor(0, 0, pxWidth / 2, pxHeight);
    renderer.setViewport(0, 0, pxWidth / 2, pxHeight);
    renderer.render(scene, this.renderCamL);

    renderer.setScissor(pxWidth / 2, 0, pxWidth / 2, pxHeight);
    renderer.setViewport(pxWidth / 2, 0, pxWidth / 2, pxHeight);
    renderer.render(scene, this.renderCamR);
    renderer.setScissor(pxWidth / 2, 0, pxWidth / 2, pxHeight);
    renderer.setViewport(pxWidth / 2, 0, pxWidth / 2, pxHeight);

    renderer.enableScissorTest(false);

  };

};
