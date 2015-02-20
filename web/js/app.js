'use strict';

var APP = {

  Player: function () {

    var loader = new THREE.ObjectLoader();
    var camera, scene, renderer, debugScene, 
        stereoCamera, debugCam, hands, leftHand, rightHand; 
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
      var bodyPos = JSON.parse(evt.data);
      if(stereoCamera){
        var pos = [bodyPos.head.x, bodyPos.head.y, bodyPos.head.z];
        // if(last && pos[0] !== last[0] && pos[1] !== last[1] && pos[2] !== last[2]){
        //   stereoCamera.setPosition(pos);
        // }
        last = pos;
      }
      if(bodyPos.left_hand){
        var left_pos = [bodyPos.left_hand.x, bodyPos.left_hand.y, bodyPos.left_hand.z];
        if(left_last && left_pos[0] !== left_last[0] && left_pos[1] !== left_last[1] && left_pos[2] !== left_last[2]){
          leftHand.setPosition(left_pos);
        }
        left_last = left_pos;
	  }
      if(bodyPos.right_hand){  
        var right_pos = [bodyPos.right_hand.x, bodyPos.right_hand.y, bodyPos.right_hand.z];
        if(right_last && right_pos[0] !== right_last[0] && right_pos[1] !== right_last[1] && right_pos[2] !== right_last[2]){
          rightHand.setPosition(right_pos);
        }
        right_last = right_pos;
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
      //hands = new Hands(scene);
      leftHand = new LeftHand(scene);
      rightHand = new RightHand(scene);
      
      debugScene.debug(false);
      stereoCamera.debug(false);
      
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
          if(last){
            stereoCamera.setPosition(last);
          }
          stereoCamera.updateFrustum({width: 100, height: 75});
          stereoCamera.updateHelpers();
        } else {
          if(last){
            stereoCamera.setPosition(last);
          }
          stereoCamera.render({width: 100, height: 75});
        }
      }, 1000/60);

    };

    this.play = function () {
      request = requestAnimationFrame(animate);
    };

    this.stop = function () {
      cancelAnimationFrame(request);
    };
  }
}

