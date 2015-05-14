'use strict';

var APP = {

  Player: function() {

    var loader = new THREE.ObjectLoader();
    var camera, scene, renderer, debugScene,
      stereoCamera, debugCam, hands, leftHand, rightHand;
    var debug = false;

    var animCallbacks = [];

    this.dom = undefined;

    this.width = 500;
    this.height = 500;

    var ws = new WebSocket('ws://localhost:8887');

    ws.onopen = function() {
      ws.send('subscribe');
      console.log('socket connected');
    };

    var last = null;
    ws.onmessage = function(evt) {
      //var position = evt.data.split(',');
      try {
        var bodyPos = JSON.parse(evt.data);
      } catch (err) {
        console.log('error', err);
        return;
      }

      if (stereoCamera) {
        var pos = [bodyPos.head.x, bodyPos.head.y, bodyPos.head.z];
        stereoCamera.setPosition(pos);
      }
      // if (bodyPos.left_hand) {
      //   var left_pos = [bodyPos.left_hand.x, bodyPos.left_hand.y, bodyPos.left_hand.z];
      //   leftHand.setPosition(left_pos);
      //   leftHand.mesh.__dirtyPosition = true;
      // }
      // if (bodyPos.right_hand) {
      //   var right_pos = [bodyPos.right_hand.x, bodyPos.right_hand.y, bodyPos.right_hand.z];
      //   rightHand.setPosition(right_pos);
      //   rightHand.mesh.__dirtyPosition = true;
      // }
    };

    ws.onclose = function() {
      console.log('disconnected')
    };


    var rot = 0;
    function keydown(event) {
      // <d> key for debug cam
      var group = scene.getObjectByName('cameraGroup');
      if (event.keyCode === 100) {
        debugScene.debug(true);
        stereoCamera.debug(true);

        // var x = Math.floor(Math.random() * 400) + 100;
        // var y = Math.floor(Math.random() * 400) + 100;
        // var z = Math.floor(Math.random() * 400) + 100;

        // var pos = [x, y, z];
        // stereoCamera.setPosition(pos);
        // <r> key for render cam
      } else if (event.keyCode === 114) {
        debugScene.debug(false);
        stereoCamera.debug(false);
      } else if(event.keyCode === 103){
        debugScene.gridHelper(true);
      // } else if(event.keyCode === 46){
      //   rot += 0.01;
      //   var euler = new THREE.Euler( 0.01, 0, 0, 'XYZ' );
      //   stereoCamera.offset = rot;
      //   group.position.applyEuler(euler);
      // } else if(event.keyCode === 44){
      //   rot -= 0.01;
      //   var group = scene.getObjectByName('cameraGroup');
      //   var euler = new THREE.Euler( -0.01, 0, 0, 'XYZ' );
      //   stereoCamera.offset = rot;
      //   group.position.applyEuler(euler);
      }


    }
    $(document).keypress(keydown);

    this.load = function(json) {


      renderer = new THREE.WebGLRenderer({
        antialias: true
      });

      renderer.shadowMapType = THREE.PCFSoftShadowMap;
      renderer.shadowMapEnabled = true;

      renderer.setPixelRatio(window.devicePixelRatio);
      this.setSize(window.innerWidth, window.innerHeight)

      var editorScene = loader.parse(json);
      scene = new Physijs.Scene();
      scene.name = editorScene.name;
      scene.children = editorScene.children;
      scene.setGravity(new THREE.Vector3(0, -50, 0));

      camera = scene.getObjectByName('cameraDebug');
      var group = scene.getObjectByName('cameraGroup');

      this.dom = renderer.domElement;

      //Screen size
      stereoCamera = new StereoCamera(renderer, scene, group, {width: 90.4875, height: 49.53});
      stereoCamera.setIO(5);
      debugScene = new DebugScene(renderer, scene, camera);

      var francis = new Francis(scene);
      var earth_object = new earthDemo(scene);

      animCallbacks.push(earth_object.animate);


      leftHand = new Hand(scene, 'LeftHand');
      rightHand = new Hand(scene, 'RightHand');

      debugScene.debug(false);
      stereoCamera.debug(false);
      var dropBoxDemo = new DropBoxDemo(scene);
      animCallbacks.push(dropBoxDemo.animate);

      var calibration = new Calibration(scene, stereoCamera, debugCam);
      animCallbacks.push(calibration.animate);
    };


    this.setSize = function(width, height) {

      this.width = width;
      this.height = height;
      renderer.setSize(width, height);

    };

    var request;

    var animate = function(time) {

      setTimeout(function() {
        request = requestAnimationFrame(animate);

        scene.simulate();

        animCallbacks.forEach(function(cb){
          cb(time);
        });

        if (debugScene.on) {
          debugScene.update();
          stereoCamera.updateFrustum();
          stereoCamera.updateHelpers();
        } else {
          stereoCamera.render();
        }
      }, 1000 / 30);

    };

    this.play = function() {
      request = requestAnimationFrame(animate);
    };

    this.stop = function() {
      cancelAnimationFrame(request);
    };
  }
}
