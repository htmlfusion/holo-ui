function DropBoxDemo(scene) {

  var self = this;
  var scene = scene;
  var shadowBox = scene.getObjectByName('shadowBox');

  this.load = function() {
    scene.remove(shadowBox);
    var box = new Physijs.BoxMesh(
      shadowBox.geometry,
      shadowBox.material
    );

    scene.add(box);
  }

  if (scene.name === 'dropBox') {
    this.load();
  }
}