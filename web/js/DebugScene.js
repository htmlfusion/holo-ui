'use strict';

function DebugScene(renderer, scene, debugCam){
  
  var self = this;
  var scene = scene;
  var on = false;
  
  var size = 500;
  var step = 50;
  
  var gridHelper = new THREE.GridHelper(size, step);
  
  var debugControls = new THREE.TrackballControls(debugCam);
  
  var projectionScreen = scene.getObjectByName('projectionPlane');
  
  debugControls.rotateSpeed = 1.0;
  debugControls.zoomSpeed = 1.2;
  debugControls.panSpeed = 0.8;
  debugControls.noZoom = false;
  debugControls.noPan = false;

  debugControls.staticMoving = true;
  debugControls.dynamicDampingFactor = 0.3;

  debugControls.keys = [65, 83, 68];
  
  self.debug = function(on){
    self.on = on;
    if(on){
      scene.add( gridHelper );
      scene.add( projectionScreen );
      //debugControls.enabled = on;
      debugCam.aspect = window.innerWidth/window.innerHeight;
      debugCam.updateProjectionMatrix();
    } else {
      scene.remove( gridHelper );
      scene.remove( projectionScreen );
      //debugControls.enabled = on;
    }
  }

  self.gridHelper = function(on){
    if(on){
      scene.add( gridHelper );
      debugCam.aspect = window.innerWidth/window.innerHeight;
      debugCam.updateProjectionMatrix();
    } else {
      scene.remove( gridHelper );
    }
    
  }
  

  this.update = function(){
    if(self.on){
      renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
      renderer.render(scene, debugCam);
      debugControls.update();
    }
  }
}