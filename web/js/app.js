'use strict';

var APP = {

  Player: function() {

    var loader = new THREE.ObjectLoader();
    var camera, scene, renderer, debugScene, controls,
      stereoCamera, debugCam, leftHand, rightHand;
    var debug = false;

    var animCallbacks = [];

    var request;
    
    var phy_test;
    
    this.dom = undefined;

    this.width = 500;
    this.height = 500;

    var handies = {};
    var loop = {};
    

    var rot = 0;
    function keydown(event) {
      // <d> key for debug cam
      var group = scene.getObjectByName('cameraGroup');
      console.log(event.keyCode);
      if (event.keyCode === 100) {
        debugScene.debug(true);
        stereoCamera.debug(true);
        // <r> key for render cam
      } else if (event.keyCode === 114) {
        debugScene.debug(false);
        stereoCamera.debug(false);
      } else if(event.keyCode === 103){
        debugScene.gridHelper(true);
      } else if(event.keyCode === 46){
        rot += 0.01;
        var euler = new THREE.Euler( 0.01, 0, 0, 'XYZ' );
        stereoCamera.offset = rot;
        group.position.applyEuler(euler);
      } else if(event.keyCode === 44){
        rot -= 0.01;
        var group = scene.getObjectByName('cameraGroup');
        var euler = new THREE.Euler( -0.01, 0, 0, 'XYZ' );
        stereoCamera.offset = rot;
        group.position.applyEuler(euler);
      }


    }
    $(document).keypress(keydown);

    this.load = function(json) {


      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      this.setSize(window.innerWidth, window.innerHeight)

      var editorScene = loader.parse(json);
      scene = new Physijs.Scene({ reportsize: 50, fixedTimeStep: 1 / 60 });
      scene.name = editorScene.name;
      scene.children = editorScene.children;
      //scene.setGravity(new THREE.Vector3(0, -5, 0));
      scene.setGravity(new THREE.Vector3(0, 0, 0));

  		scene.addEventListener(
			'update',
        function() {
          //scene.simulate( undefined, 2 );
          //physics_stats.update();
          //controls.update();
        }
      );
      
      
      camera = scene.getObjectByName('cameraDebug');
      var group = scene.getObjectByName('cameraGroup');

      this.dom = renderer.domElement;

      stereoCamera = new StereoCamera(renderer, scene, group);
      debugScene = new DebugScene(renderer, scene, camera);
      
      //var francis = new Francis(scene);
      //var earth_object = new earthDemo(scene);
      var earth_object = new earthDemoLight(scene);

      animCallbacks.push(earth_object.animate);

      //phy_test = new PhyTest(scene);
      //animCallbacks.push(phy_test.animate);
      //leftHand = new LeftHand(scene);
      //rightHand = new RightHand(scene);

      debugScene.debug(false);
      stereoCamera.debug(false);
      var dropBoxDemo = new DropBoxDemo(scene);
    };


    this.setSize = function(width, height) {

      this.width = width;
      this.height = height;
      renderer.setSize(width, height);

    };



	  loop.animate = function( frame ) {
    
      frame.hands.forEach( function( hand, index ) {
        var handy = ( handies[index] || ( handies[index] = new Handy(scene)) );    
        handy.outputData( index, hand );
        
        
      });
		  

    /**
    request = requestAnimationFrame(loop.animate);
    scene.simulate();
    
    stereoCamera.render({
            width: 100,
            height: 75
          });
     **/     
    //scene.simulate( undefined, 1 );
    //controls.update();
    
    /**
        clouds.rotation.y+=.002
        earth.rotation.y+=.001
        //cameraHelper.visible = true;
        //cameraHelper2.visible = true;
        camera.lookAt(earth.position);
        camera.updateProjectionMatrix();
        effect.render( scene, camera );
      **/  

		//if (HELPERS) {
		//	stats.update();
		//}   

	  }

    loop = Leap.loop( loop.animate );
    
    var animate = function(time) {
      setTimeout(function() {
        //phy_test.animate();
        request = requestAnimationFrame(animate);
        //console.log(leftHand);
        //console.log(rightHand);
        scene.simulate();
        animCallbacks.forEach(function(cb){
          cb();
        });

        if (debugScene.on) {
          debugScene.update();
          stereoCamera.updateFrustum({
            width: 100,
            height: 75
          });
          stereoCamera.updateHelpers();
        } else {
          stereoCamera.render({
            width: 100,
            height: 75
          });
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
