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
        stereoCamera.setHead(bodyPos.head);
      }
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
      } else if (event.keyCode === 114) {
        debugScene.debug(false);
        stereoCamera.debug(false);
      } else if(event.keyCode === 103){
        debugScene.gridHelper(true);
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
      stereoCamera.setIO(7);
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

      var refrigerator = new Refrigerator(scene, stereoCamera);
      animCallbacks.push(refrigerator.animate);

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
      }, 1000 / 60);

    };

    this.play = function() {
      request = requestAnimationFrame(animate);
    };

    this.stop = function() {
      cancelAnimationFrame(request);
    };
  }
}
