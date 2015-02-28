'use strict';


function Hand(scene, name) {

  var self = this;

  var renderer = renderer;
  var scene = scene;
  var group = group;
  var transform = new THREE.Matrix4();
  transform.set(1.0767210688730582, -0.0224848567940982, 0.03825194115293704, -3.8477102953334557, 0.030423768295330025, 1.05036714077187, -0.2389566986958065, 53.64223320912849, -0.03229820598316467, 0.2398339857981666, 1.0501111965352017, -75.8564358689001, 0.0, 0.0, 0.0, 1.0);

  var left = scene.getObjectByName(name);

  var material = Physijs.createMaterial(
    left.material
  );

  var handMesh = new Physijs.BoxMesh(
    left.geometry,
    material
  );

  handMesh.position.x = left.position.x;
  handMesh.position.y = left.position.y;
  handMesh.position.z = left.position.z;
  handMesh.__dirtyPosition = true;
  scene.remove(left);
  scene.add(handMesh);

  self.mesh = handMesh;

  self.setPosition = function(position) {
    var pos = transform.applyToVector3Array([-position[0]/10, position[1]/10, position[2]/10]);
    handMesh.position.x = pos[0];
    handMesh.position.y = pos[1];
    handMesh.position.z = pos[2];
    handMesh.__dirtyPosition = true;
  };

}