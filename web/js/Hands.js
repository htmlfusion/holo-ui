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
    leftHandMesh.position.y = position[1] / 10 + 20;
    leftHandMesh.position.z = position[2] / 10;
    leftHandMesh.__dirtyPosition = true;
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
    rightHandMesh.__dirtyPosition = true;

  };


}