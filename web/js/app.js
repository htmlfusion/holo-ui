/**
 * @author mrdoob / http://mrdoob.com/
 */

var APP = {

  Player: function () {

    var loader = new THREE.ObjectLoader();
    var camera, scene, renderer, debugControls;
    var debug=false;

    var scripts = {};

    this.dom = undefined;

    this.width = 500;
    this.height = 500;

    this.toggleDebug = function(){
      
    };
    
    this.setupCameras = function(){
      
      var self=this;
      var renderCamL = scene.getObjectByName( 'cameraLeft' );
      var renderCamR = scene.getObjectByName( 'cameraRight' );
      var debugCam = scene.getObjectByName( 'cameraDebug' );
      
      var camHelper = new THREE.CameraHelper(renderCamL);
      
      debugControls = new THREE.TrackballControls(debugCam);
      
      debugControls.rotateSpeed = 1.0;
      debugControls.zoomSpeed = 1.2;
      debugControls.panSpeed = 0.8;

      debugControls.noZoom = false;
      debugControls.noPan = false;

      debugControls.staticMoving = true;
      debugControls.dynamicDampingFactor = 0.3;

      debugControls.keys = [ 65, 83, 68 ];
      
      function keydown( event) {
          
          // <d> key for debug cam
        if(event.keyCode === 100){
          self.setCamera(debugCam);
          scene.add(camHelper);
          debug=true;
          debugControls.enabled = debug;
          // <r> key for render cam
        } else if (event.keyCode === 114){
          self.setCamera(renderCamL);
          debug=false;
          debugControls.enabled = debug;
          scene.remove(camHelper);
        }
        
      }
      
      $(document).keypress(keydown);
    };

    this.load = function ( json ) {

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setPixelRatio( window.devicePixelRatio );

      camera = loader.parse( json.camera );
      scene = loader.parse( json.scene );

      scripts = {
        keydown: [],
        keyup: [],
        mousedown: [],
        mouseup: [],
        mousemove: [],
        update: []
      };

      for ( var uuid in json.scripts ) {

        var object = scene.getObjectByProperty( 'uuid', uuid, true );

        var sources = json.scripts[ uuid ];

        for ( var i = 0; i < sources.length; i ++ ) {

          var script = sources[ i ];

          var events = ( new Function( 'player', 'scene', 'keydown', 'keyup', 'mousedown', 'mouseup', 'mousemove', 'update', script.source + '\nreturn { keydown: keydown, keyup: keyup, mousedown: mousedown, mouseup: mouseup, mousemove: mousemove, update: update };' ).bind( object ) )( this, scene );

          for ( var name in events ) {

            if ( events[ name ] === undefined ) continue;

            if ( scripts[ name ] === undefined ) {

              console.warn( 'APP.Player: event type not supported (', name, ')' );
              continue;

            }

            scripts[ name ].push( events[ name ].bind( object ) );

          }

        }

      }

      this.dom = renderer.domElement;
      
      this.setupCameras();

    };

    this.setCamera = function ( value ) {

      camera = value;
      camera.aspect = this.width / this.height;
      camera.updateProjectionMatrix();

    };

    this.setSize = function ( width, height ) {

      this.width = width;
      this.height = height;

      camera.aspect = this.width / this.height;
      camera.updateProjectionMatrix();

      renderer.setSize( width, height );

    };

    var dispatch = function ( array, event ) {

      for ( var i = 0, l = array.length; i < l; i ++ ) {

        array[ i ]( event );

      }

    };

    var request;

    var animate = function ( time ) {

      request = requestAnimationFrame( animate );

      dispatch( scripts.update, { time: time } );

      renderer.render( scene, camera );
      
      if(debugControls){
        debugControls.update();
      }

    };

    this.play = function () {

      document.addEventListener( 'keydown', onDocumentKeyDown );
      document.addEventListener( 'keyup', onDocumentKeyUp );
      document.addEventListener( 'mousedown', onDocumentMouseDown );
      document.addEventListener( 'mouseup', onDocumentMouseUp );
      document.addEventListener( 'mousemove', onDocumentMouseMove );

      request = requestAnimationFrame( animate );

    };

    this.stop = function () {

      document.removeEventListener( 'keydown', onDocumentKeyDown );
      document.removeEventListener( 'keyup', onDocumentKeyUp );
      document.removeEventListener( 'mousedown', onDocumentMouseDown );
      document.removeEventListener( 'mouseup', onDocumentMouseUp );
      document.removeEventListener( 'mousemove', onDocumentMouseMove );

      cancelAnimationFrame( request );

    };

    //

    var onDocumentKeyDown = function ( event ) {

      dispatch( scripts.keydown, event );

    };

    var onDocumentKeyUp = function ( event ) {

      dispatch( scripts.keyup, event );

    };

    var onDocumentMouseDown = function ( event ) {

      dispatch( scripts.mousedown, event );

    };

    var onDocumentMouseUp = function ( event ) {

      dispatch( scripts.mouseup, event );

    };

    var onDocumentMouseMove = function ( event ) {

      dispatch( scripts.mousemove, event );

    };

  }

};

