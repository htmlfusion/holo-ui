/**
 * @author mrdoob / http://mrdoob.com/
 */

var APP = {

  Player: function () {

    var loader = new THREE.ObjectLoader();
    var camera, scene, renderer, debugControls, camHelper;
    var debug = false;

    var scripts = {};

    this.dom = undefined;

    this.width = 500;
    this.height = 500;

    this.connectToPeer = function () {
      var channel = new DataChannel('camera-room');

      channel.onopen = function (userid) {
        console.log('opened '+userid);
      };

      channel.onmessage = function (message, userid) {
        console.log('message', message)
      };

      channel.onleave = function (userid) {
        console.log('user left');
      };
    }

    this.setupCameras = function () {

      var self = this;
      var renderCamL = scene.getObjectByName('cameraLeft');
      var renderCamR = scene.getObjectByName('cameraRight');
      var debugCam = scene.getObjectByName('cameraDebug');

      camHelper = new THREE.CameraHelper(renderCamL);
      
      var size = 500;
      var step = 50;

      var gridHelper = new THREE.GridHelper( size, step );		

      debugControls = new THREE.TrackballControls(debugCam);

      debugControls.rotateSpeed = 1.0;
      debugControls.zoomSpeed = 1.2;
      debugControls.panSpeed = 0.8;

      debugControls.noZoom = false;
      debugControls.noPan = false;

      debugControls.staticMoving = true;
      debugControls.dynamicDampingFactor = 0.3;

      debugControls.keys = [65, 83, 68];

      function keydown(event) {

        // <d> key for debug cam
        if (event.keyCode === 100) {
          debug = true;
          self.setCamera(debugCam);
          scene.add(camHelper);
          scene.add( gridHelper );
          debugControls.enabled = debug;
          // <r> key for render cam
        } else if (event.keyCode === 114) {
          debug = false;
          self.setCamera(renderCamL);
          debugControls.enabled = debug;
          scene.remove(camHelper);
          scene.remove( gridHelper );
        }

      }

      $(document).keypress(keydown);
    };

    this.load = function (json) {

      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);

      camera = loader.parse(json.camera);
      scene = loader.parse(json.scene);

      scripts = {
        keydown: [],
        keyup: [],
        mousedown: [],
        mouseup: [],
        mousemove: [],
        update: []
      };

      for (var uuid in json.scripts) {

        var object = scene.getObjectByProperty('uuid', uuid, true);

        var sources = json.scripts[uuid];

        for (var i = 0; i < sources.length; i++) {

          var script = sources[i];

          var events = (new Function('player', 'scene', 'keydown',
            'keyup', 'mousedown', 'mouseup', 'mousemove',
            'update', script.source +
            '\nreturn { keydown: keydown, keyup: keyup, mousedown: mousedown, mouseup: mouseup, mousemove: mousemove, update: update };'
          ).bind(object))(this, scene);

          for (var name in events) {

            if (events[name] === undefined) continue;

            if (scripts[name] === undefined) {

              console.warn(
                'APP.Player: event type not supported (', name,
                ')');
              continue;

            }

            scripts[name].push(events[name].bind(object));

          }

        }

      }

      this.dom = renderer.domElement;

      this.setupCameras();
      this.connectToPeer();
      
    };

    this.setCamera = function (value) {
      camera = value;
      camera.aspect = this.width / this.height;
      if(debug){
        camera.updateProjectionMatrix();
      }
    };
    
    var updateFrustum = function(){
      // http://bl0rg.net/~manuel/opengl2.pde
      
      var leftCamera = scene.getObjectByName('cameraLeft');
      var group = scene.getObjectByName('cameraGroup');
      var vector = new THREE.Vector3();
      vector.setFromMatrixPosition(leftCamera.matrixWorld);
      
      var near = 10;
      var width = 100;
      var pxWidth = 1920;
      var pxSize = pxWidth/width;;
      var height = 75;
      
      var leftScreen = width/2.0+vector.x;
      var left = near / vector.z * leftScreen;
      
      var rightScreen = width/2.0-vector.x;
      var right = near / vector.z * rightScreen;
      
      var bottomScreen = -height/2.0-vector.y;
      var bottom = near / vector.z * bottomScreen;
      
      var topScreen = height/2.0-vector.y;
      var top = near / vector.z * topScreen;
      
      leftCamera.projectionMatrix.makeFrustum(
        -left, //left
        right,//right
        bottom, //bottom
        top, //top
        near,
        60000
      );

      
    }

    this.setSize = function (width, height) {

      this.width = width;
      this.height = height;

      camera.aspect = this.width / this.height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);

    };

    var dispatch = function (array, event) {

      for (var i = 0, l = array.length; i < l; i++) {

        array[i](event);

      }

    };

    var request;

    var animate = function (time) {

      request = requestAnimationFrame(animate);

      dispatch(scripts.update, {
        time: time
      });

      renderer.render(scene, camera);

      if (debugControls) {
        debugControls.update();
        camHelper.update();
      }
      
      updateFrustum();

    };

    this.play = function () {

      document.addEventListener('keydown', onDocumentKeyDown);
      document.addEventListener('keyup', onDocumentKeyUp);
      document.addEventListener('mousedown', onDocumentMouseDown);
      document.addEventListener('mouseup', onDocumentMouseUp);
      document.addEventListener('mousemove', onDocumentMouseMove);

      request = requestAnimationFrame(animate);

    };

    this.stop = function () {

      document.removeEventListener('keydown', onDocumentKeyDown);
      document.removeEventListener('keyup', onDocumentKeyUp);
      document.removeEventListener('mousedown',
        onDocumentMouseDown);
      document.removeEventListener('mouseup', onDocumentMouseUp);
      document.removeEventListener('mousemove',
        onDocumentMouseMove);

      cancelAnimationFrame(request);

    };

    //

    var onDocumentKeyDown = function (event) {

      dispatch(scripts.keydown, event);

    };

    var onDocumentKeyUp = function (event) {

      dispatch(scripts.keyup, event);

    };

    var onDocumentMouseDown = function (event) {

      dispatch(scripts.mousedown, event);

    };

    var onDocumentMouseUp = function (event) {

      dispatch(scripts.mouseup, event);

    };

    var onDocumentMouseMove = function (event) {

      dispatch(scripts.mousemove, event);

    };

  }

};