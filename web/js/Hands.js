'use strict';


function LeftHand(scene) {

  var self = this;

  var renderer = renderer;
  var scene = scene;
  var group = group;

  var left = scene.getObjectByName('LeftHand');

  var material = Physijs.createMaterial(
    left.material,
    0.1,
    1
  );

  var leftHandMesh = new Physijs.BoxMesh(
    left.geometry,
    material,
    0
  );
  leftHandMesh.position.x = left.position.x;
  leftHandMesh.position.y = left.position.y;
  leftHandMesh.position.z = left.position.z;
  leftHandMesh.__dirtyPosition = true;
  scene.remove(left);
  scene.add(leftHandMesh);

  self.mesh = leftHandMesh;

  self.setPosition = function(position) {
    //leftHand.position.set(-position[0]/10, position[1]/10+20, position[2]/10);
    leftHandMesh.position.x = -position[0] / 10;
    leftHandMesh.position.y = position[1] / 10 ;
    leftHandMesh.position.z = position[2] / 10 - 80;
    //leftHandMesh.__dirtyPosition = true;
  };

}


function RightHand(scene) {

  var self = this;

  var renderer = renderer;
  var scene = scene;
  var group = group;

  var right = scene.getObjectByName('RightHand');

  var material = Physijs.createMaterial(
    right.material,
    0.1,
    1
  );

  var rightHandMesh = new Physijs.BoxMesh(
    right.geometry,
    material,
    0
  );

  rightHandMesh.position.x = right.position.x;
  rightHandMesh.position.y = right.position.y;
  rightHandMesh.position.z = right.position.z;
  rightHandMesh.__dirtyPosition = true;
  scene.remove(right);
  scene.add(rightHandMesh);

  self.mesh = rightHandMesh;

  self.setPosition = function(position) {
    rightHandMesh.position.x = -position[0] / 10;
    rightHandMesh.position.y = position[1] / 10 + 20;
    rightHandMesh.position.z = position[2] / 10;
    //rightHandMesh.__dirtyPosition = true;

  };


}

var Handy = function(scene) {
		var handy = this;
  
    
		var geometry = new THREE.BoxGeometry( 5, 2, 5 );
    var friction = .8; // high friction
    var restitution = .3; // low restitution
    
    var material = Physijs.createMaterial(
                      new THREE.MeshBasicMaterial({ color: 0x888888 }),
                      friction,
                      restitution
                    );
    
		var material = new THREE.MeshNormalMaterial();    
    
    var box = new Physijs.BoxMesh(
                    geometry,
                    material,
                    1
                  );
  
		scene.add( box );

		handy.outputData = function( index, hand, camera  ) {
       var ray, intersections;
           // Intersect
      var _vector = new THREE.Vector3;

      box.position.__dirtyPosition = true;
			box.position.set( hand.stabilizedPalmPosition[0]/11, hand.stabilizedPalmPosition[1]/11 - 20 , hand.stabilizedPalmPosition[2]/11 + 70 );
      //box.position.__dirtyPosition = false;
      box.rotation.__dirtyRotation = true;
			box.rotation.set( hand.pitch(), -hand.yaw(), hand.roll() );
      //box.rotation.__dirtyRotation = false;
 
      var position = hand.palmPosition;
      var velocity = hand.palmVelocity;
      var direction = hand.direction;
      
      _vector.set( direction[0], direction[1], direction[2]);
      
      /**
      _vector.set(
				( hand.stabilizedPalmPosition[0]/11 / window.innerWidth ) * 2 - 1,
				-( hand.stabilizedPalmPosition[1]/11 - 20 / window.innerHeight ) * 2 + 1,
				hand.stabilizedPalmPosition[2]/11 + 70
			);
      */
      
			//projector.unprojectVector( _vector, camera );
      //_vector.unproject( camera );
			

      
    
      var earth =  scene.getObjectByName('SphereTarget');
      ray = new THREE.Raycaster( position, _vector.normalize() );
			//ray = new THREE.Raycaster( camera.position, _vector.sub( camera.position ).normalize() );
      
      //ray = new THREE.Raycaster();
      //ray.setFromCamera(_vector, camera);
      

      //console.log("p:"+position[0]
      
			intersections = ray.intersectObject( earth );
      
      if (intersections.length) {
        console.log(intersections.length);
        for ( var i = 0; i < intersections.length; i++ ) {
          intersects[ i ].object.material.color.set( 0xff0000 );
        }
      }
      
      

		};

};
