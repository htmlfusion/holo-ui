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
    table.position.y = tableBox.position.y;
    table.position.z = tableBox.position.z-8;

    table.rotation.x = -.03;

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

    if(!loaded){
      return;
    }

    frame++;

    if(frame%60===0){

      var shape = Math.random(),
        size = Math.round(getRandomArbitrary(2, 8)),
        colors = ['#0066FF', '#FF66FF', '#00CC99', '#FF9900'],
        geo,
        color;

      var rand = Math.random();
      rand *= colors.length; //(5)
      rand = Math.floor(rand);

      color = colors[rand];

      if(shape < .5){
        geo = new Physijs.BoxMesh(
          new THREE.BoxGeometry( size, size, size , 10, 10, 10),
          new THREE.MeshPhongMaterial({ color: color })
        );
      } else {
        geo = new Physijs.SphereMesh(
          new THREE.SphereGeometry( size, 40, 40 ),
          new THREE.MeshPhongMaterial({ color: color })
        );
      }


      geo.position.x = getRandomArbitrary(-5, 5);
      geo.position.y = getRandomArbitrary(29, 50);
      geo.position.z = getRandomArbitrary(-10, 100);
      geo.rotation.x = Math.random();
      geo.rotation.y = Math.random();
      geo.rotation.z = Math.random();
      geo.castShadow = true;
      geo.receiveShadow= true;
      geo.setCcdMotionThreshold(1);
      geo.setCcdSweptSphereRadius(size/5);


      scene.add( geo );

    }

  }


}