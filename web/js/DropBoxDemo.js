function DropBoxDemo(scene) {

  var self = this;
  var scene = scene;
  var shadowBox = scene.getObjectByName('shadowBox');
  scene.remove(shadowBox);

  this.load = function() {
    console.log(shadowBox);
    var box = new Physijs.BoxMesh(
      shadowBox.geometry,
      shadowBox.material
    );

    scene.add(box);
  }

  if (shadowBox) {
    this.load();
  }
}