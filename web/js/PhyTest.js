function PhyTest(scene) {

  var self = this;
  var scene = scene;
  var target = scene.getObjectByName('SphereTarget');
  var left = scene.getObjectByName('LeftHand');
  var right = scene.getObjectByName('RightHand');
  var _vector = new THREE.Vector3; 
  var rightHandMesh;
    
  this.load = function() {

   // earth.position.set(0, 0, 70)
  
  var target_material = Physijs.createMaterial(
    target.material,
    0.1,
    1
  );
  
  var targetMesh = new Physijs.SphereMesh(
    target.geometry,
    target_material,
    0.6
  );
  
  targetMesh.position.x = target.position.x;
  targetMesh.position.y = target.position.y;
  targetMesh.position.z = target.position.z; 
  
  targetMesh.name = "PhySphereTarget";
  
  scene.remove(target);
  scene.add(targetMesh);
  
  // Left Hand / sphere

  var material = Physijs.createMaterial(
    left.material,
    0.1,
    1
  );

  var leftHandMesh = new Physijs.SphereMesh(
    left.geometry,
    material,
    0.8
  );
  leftHandMesh.position.x = left.position.x;
  leftHandMesh.position.y = left.position.y;
  leftHandMesh.position.z = left.position.z;
  //leftHandMesh.__dirtyPosition = true;
  scene.remove(left);
  scene.add(leftHandMesh);


  // Right Hand / sphere

  material = Physijs.createMaterial(
    right.material,
    0.1,
    1
  );

  rightHandMesh = new Physijs.SphereMesh(
    right.geometry,
    material,
    1
  );

  rightHandMesh.position.x = right.position.x;
  rightHandMesh.position.y = right.position.y;
  rightHandMesh.position.z = right.position.z;
  //rightHandMesh.__dirtyPosition = true;
  
       
  scene.remove(right);
  scene.add(rightHandMesh);



  }

  this.animate = function(scene){
    // get the hand sphere moving
    console.log('animate');
    
     _vector.set( 0, 0, 0 );
  //rightHandMesh.applyCentralImpulse(_vector);
  rightHandMesh.setAngularFactor( _vector );
  rightHandMesh.setLinearFactor( _vector );
  // x,y,z
    _vector.set( -0.15, 0, -0.75 );
  rightHandMesh.setAngularVelocity( _vector );
   _vector.set(-5, 0, -40);
  rightHandMesh.setLinearVelocity( _vector );
   
   
 
  }

  if (scene.name === 'PhyTest') {
    this.load();
  }

}
