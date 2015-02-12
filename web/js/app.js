'use strict';

var APP = {

  Player: function () {

    var loader = new THREE.ObjectLoader();
    var camera, scene, renderer, debugScene, 
        stereoCamera, debugCam; 
    var debug = false;

    var scripts = {};

    this.dom = undefined;

    this.width = 500;
    this.height = 500;
    
    var ws = new WebSocket('ws://localhost:8887');
    
    ws.onopen = function(){
      console.log('socket connected');
    };
    
    ws.onmessage = function (evt) { 
      var position = evt.data.split(',');
      if(group){
        group.position.x = -position[0]/10;
        group.position.y = position[1]/10;
        group.position.z = position[2]/10;
      }
    };
    
    ws.onclose = function() { 
      console.log('disconnected')
    };
    
    
    function keydown(event) {
      // <d> key for debug cam
      if (event.keyCode === 100) {
        debugScene.debug(true);
        stereoCamera.debug(true);
      // <r> key for render cam
      } else if (event.keyCode === 114) {
        debugScene.debug(false);
        stereoCamera.debug(false);
      }
    }
    $(document).keypress(keydown);
    
    this.load = function (json) {

      
      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      this.setSize(window.innerWidth, window.innerHeight)

      scene = loader.parse(json);
      camera = scene.getObjectByName('cameraDebug');
      var group = scene.getObjectByName('cameraGroup');

      this.dom = renderer.domElement;
      
      stereoCamera = new StereoCamera(renderer, scene, group);
      debugScene = new DebugScene(renderer, scene, camera);
      
    };

    this.setSize = function (width, height) {

      this.width = width;
      this.height = height;
      renderer.setSize(width, height);
      
    };

    var request;

    var animate = function (time) {

      request = requestAnimationFrame(animate);

      if(debugScene.on){
        debugScene.update();
        stereoCamera.updateHelpers();
      } else {
        stereoCamera.render({width: 100, height: 75});
      }

    };

    this.play = function () {
      request = requestAnimationFrame(animate);
    };

    this.stop = function () {
      cancelAnimationFrame(request);
    };
  }
}

