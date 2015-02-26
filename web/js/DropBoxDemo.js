function DropBoxDemo(scene) {

  var self = this;
  var scene = scene;
  var shadowBox = scene.getObjectByName('shadowBox');
  var tableBox = scene.getObjectByName('Table');
  var spotLight = scene.getObjectByName('ProjectorLight');
  var loaded = false;

  this.load = function() {

    spotLight.castShadow = true;

    //spotLight.shadowDarkness = 0.5;
    spotLight.shadowMapWidth = 1024*8;
    spotLight.shadowMapHeight = 1024*8;



    var box_material = Physijs.createMaterial(
      shadowBox.material
      // 0.1,
      // 1
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
      tableBox.material
      // .8, // high friction
      // .9 // low restitution
    );

    // Ground
    var table = new Physijs.BoxMesh(
      tableBox.geometry,
      table_material,
      0 // mass
    );

    box.castShadow = true;
    box.receiveShadow= true;

    table.castShadow = true;
    table.receiveShadow = true;

    table.position.x = tableBox.position.x;
    table.position.y = tableBox.position.y-14;
    table.position.z = tableBox.position.z;

    scene.remove(tableBox);
    scene.add(table);

    loaded = true;
  }


  if (scene.name === 'dropBox') {
    this.load();
  }

  var frame  = 0;
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  this.animate = function(time){

    frame++;

    if(frame%120===0){

      var shape = Math.random(),
        geo;

      if(shape < .5){
        geo = new Physijs.BoxMesh(
          new THREE.CubeGeometry( 10, 10, 10 , 10, 10, 10),
          new THREE.MeshBasicMaterial({ color: '#0066FF' })
        );
      } else {
        geo = new Physijs.SphereMesh(
          new THREE.SphereGeometry( 10, 40, 40 ),
          new THREE.MeshBasicMaterial({ color: '#0066FF' })
        );
      }


      geo.position.x = getRandomArbitrary(-5, 5);
      geo.position.y = getRandomArbitrary(29, 50);
      geo.position.z = getRandomArbitrary(-50, 30);
      geo.rotation.x = Math.random();
      geo.rotation.y = Math.random();
      geo.rotation.z = Math.random();
      geo.castShadow = true;
      geo.receiveShadow= true;

      scene.add( geo );

    }

  }


}