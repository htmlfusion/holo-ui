'use strict';


function Francis(scene){

	var self=this;

	var scene = scene;

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) {
		console.log('Error downloading obj');
	};

    this.load = function () {
		
		THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

		var loader = new THREE.OBJMTLLoader();
		loader.load( 'obj/model_mesh.obj', 'obj/model_mesh.obj.mtl', function ( object ) {
			object.position.y = 0;
			object.position.z = 35;
			object.position.x = 0;
			
			object.scale.set( 100, 100, 100 );

			scene.add( object );
			
			console.log("Object added to scene");

		}, onProgress, onError );
	}
	

	if (scene.name === 'Francis') {
		this.load();
	}
}
