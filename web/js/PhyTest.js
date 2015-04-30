function PhyTest(scene) {

  var self = this;
  var scene = scene;
  var clouds, earth;

  this.load = function() {

   // earth.position.set(0, 0, 70)
  
  var target = scene.getObjectByName('SphereTarget');
  
  var target_material = Physijs.createMaterial(
    target.material,
    0.1,
    1
  );
  
  var targetMesh = new Physijs.Mesh(
    target.geometry,
    target_material,
    1
  );
  
 // targetMesh.position.x = target.position.x;
 // targetMesh.position.y = target.position.y;
 // targetMesh.position.z = target.position.z; 
  
    
  scene.remove(target);
  scene.add(targetMesh);
  
  // Left Hand / sphere
    
  var left = scene.getObjectByName('LeftHand');

  var material = Physijs.createMaterial(
    left.material,
    0.1,
    1
  );

  var leftHandMesh = new Physijs.Mesh(
    left.geometry,
    material,
    1
  );
  leftHandMesh.position.x = left.position.x;
  leftHandMesh.position.y = left.position.y;
  leftHandMesh.position.z = left.position.z;
  //leftHandMesh.__dirtyPosition = true;
  scene.remove(left);
  scene.add(leftHandMesh);


  // Right Hand / sphere

  var right = scene.getObjectByName('RightHand');

  material = Physijs.createMaterial(
    right.material,
    0.1,
    1
  );

  var rightHandMesh = new Physijs.Mesh(
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

  this.animate = function(){
    // get the hand sphere moving
  }

  if (scene.name === 'PhyTest') {
    this.load();
  }

}
