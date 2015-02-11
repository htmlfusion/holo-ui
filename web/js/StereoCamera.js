'use strict';


function StereoCamera(renderer, scene, group){
  
  var self=this;
  
  var renderer = renderer;
  var scene = scene;
  var group = group;
  
  var renderCamL = group.getChildByName('cameraLeft');
  var renderCamR = group.getChildByName('cameraRight');
  
  var camHelperL = new THREE.CameraHelper(renderCamL);
  var camHelperR = new THREE.CameraHelper(renderCamR);
  
  var size = 500;
  var step = 50;
  var debug = false

  var gridHelper = new THREE.GridHelper( size, step );

  self.debug = function(on){
    debug = on;
    if(on){
      scene.add(camHelperL);
      scene.add(camHelperR);
      scene.add(gridHelper);
    } else {
      scene.remove(camHelperL);
      scene.remove(camHelperR);
      scene.remove(gridHelper);
    }
  };
  
  self.setIO = function(distance){
    camHelperL.position.x = -distance/2;
    camHelperR.position.x = distance/2;
  };
  
  self.render = function(screenOpts) {
    
    if (debug) {
      camHelperL.update();
      camHelperR.update();
    }
    
    var vectorL = new THREE.vectorL3();
    vectorL.setFromMatrixPosition(renderCamL.matrixWorld);
    
    var near = 10;
    var pxWidth = 1920;
    var pxHeight = 1080;
    
    var width = screenOpts.width;
    var pxSize = pxWidth/width;;
    var height = screenOpts.height;
    
    var leftScreen = width/2.0+vectorL.x;
    var left = near / vectorL.z * leftScreen;
    
    var rightScreen = width/2.0-vectorL.x;
    var right = near / vectorL.z * rightScreen;
    
    var bottomScreen = -height/2.0-vectorL.y;
    var bottom = near / vectorL.z * bottomScreen;
    
    var topScreen = height/2.0-vectorL.y;
    var top = near / vectorL.z * topScreen;
    
    renderCamL.projectionMatrix.makeFrustum(
      -left, //left
      right,//right
      bottom, //bottom
      top, //top
      near,
      60000
    );

    var vectorR = new THREE.vectorL3();
    vectorR.setFromMatrixPosition(renderCamR.matrixWorld);
    
    var leftScreen = width/2.0+vectorR.x;
    var left = near / vectorL.z * leftScreen;
    
    var rightScreen = width/2.0-vectorR.x;
    var right = near / vectorL.z * rightScreen;
    
    var bottomScreen = -height/2.0-vectorR.y;
    var bottom = near / vectorR.z * bottomScreen;
    
    var topScreen = height/2.0-vectorR.y;
    var top = near / vectorR.z * topScreen;
    
    renderCamR.projectionMatrix.makeFrustum(
      -left, //left
      right,//right
      bottom, //bottom
      top, //top
      near,
      60000
    );
    
    
    renderCamR.aspect = (window.innerWidth / window.innerHeight)/2;
    renderCamL.aspect = (window.innerWidth / window.innerHeight)/2;
    
    renderer.clear();
    renderer.enableScissorTest(true);

    renderer.setScissor(0, 0, pxWidth, pxHeight);
    renderer.setViewport(0, 0, pxWidth, pxHeight);
    renderer.render(scene, renderCamL);

    renderer.setScissor(pxWidth, 0, pxWidth, pxHeight);
    renderer.setViewport(pxWidth, 0, pxWidth, pxHeight);
    renderer.render(scene, renderCamR);

    renderer.enableScissorTest(false);

  };
  
};