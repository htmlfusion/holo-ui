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
      ws.send('subscribe');
      console.log('socket connected');
    };
    
    var last = null;
    ws.onmessage = function (evt) { 
      //var position = evt.data.split(',');
      var data = JSON.parse(evt.data);
      if(stereoCamera){
        var pos = [data.x, data.y, data.z];
        if(last && pos[0] !== last[0] && pos[1] !== last[1] && pos[2] !== last[2]){
          stereoCamera.setPosition(pos);
        }
        last = pos;
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

      setTimeout(function() {
        request = requestAnimationFrame(animate);
        if(debugScene.on){
          debugScene.update();
          stereoCamera.updateHelpers();
          stereoCamera.updateFrustum({width: 100, height: 75});
        } else {
          stereoCamera.render({width: 100, height: 75});
        }
      }, 1000/15);

    };

    this.play = function () {
      request = requestAnimationFrame(animate);
    };

    this.stop = function () {
      cancelAnimationFrame(request);
    };
  }
}

