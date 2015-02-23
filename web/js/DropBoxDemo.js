function DropBoxDemo(scene) {

  var self = this;
  var scene = scene;
  var shadowBox = scene.getObjectByName('shadowBox');
  var tableBox = scene.getObjectByName('Table');

  this.load = function() {

    var box_material = Physijs.createMaterial(
      shadowBox.material,
      0.1,
      1
    );

    var box = new Physijs.BoxMesh(
      shadowBox.geometry,
      box_material
    );
    box.position.x = shadowBox.position.x;
    box.position.y = shadowBox.position.y;
    box.position.z = shadowBox.position.z;

    scene.remove(shadowBox);
    scene.add(box);

    // Materials
    var table_material = Physijs.createMaterial(
      tableBox.material,
      .8, // high friction
      .9 // low restitution
    );

    // Ground
    var table = new Physijs.BoxMesh(
      tableBox.geometry,
      table_material,
      0 // mass
    );
    table.receiveShadow = true;
    table.position.x = tableBox.position.x;
    table.position.y = tableBox.position.y;
    table.position.z = tableBox.position.z;
    scene.remove(tableBox);
    scene.add(table);

  }


  if (scene.name === 'dropBox') {
    this.load();
  }


}