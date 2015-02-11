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

      scene = loader.parse(json);
      camera = scene.getObjectByName('cameraDebug');

      this.setCamera(camera);
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

    var request;

    var animate = function (time) {

      request = requestAnimationFrame(animate);

      renderer.render(scene, camera);

      if (debugControls) {
        debugControls.update();
        camHelper.update();
      }
      
      updateFrustum();

    };

    this.play = function () {
      request = requestAnimationFrame(animate);
    };

    this.stop = function () {
      cancelAnimationFrame(request);
    };
  }
}

