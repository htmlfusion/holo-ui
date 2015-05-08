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

    shadowBox.material.color = 'black';

    scene.remove(shadowBox);
    scene.add(box);


    // Floor
    var floor = new Physijs.BoxMesh(
      new THREE.BoxGeometry( 1000, 2, 1000, 0, 0, 0),
      new THREE.MeshPhongMaterial({ color: 'blue' , transparent: true, opacity: 0}),
      0
    );

    floor.position.y = -150;

    scene.add(floor);

    // Furniture 1
    var tableB = new Physijs.BoxMesh(
      new THREE.BoxGeometry( 55, 2, 55, 0, 0, 0),
      shadowBox.material,
      0
    );
    tableB.position.x = -10;
    tableB.position.y = -35;
    tableB.position.z = -200;
    scene.add(tableB);

    // Furniture 3
    var tableC = new Physijs.BoxMesh(
      new THREE.BoxGeometry( 140, 2, 55, 0, 0, 0),
      shadowBox.material,
      0
    );
    tableC.position.x = 50;
    tableC.position.y = -85;
    tableC.position.z = -200;
    scene.add(tableC);

    // Screen
    var screen = new Physijs.BoxMesh(
      new THREE.BoxGeometry( 70, 25, 2, 0, 0, 0),
      shadowBox.material,
      0
    );
    screen.position.x = -5;
    screen.position.y = 0;
    screen.position.z = -200;
    scene.add(screen);

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
    table.position.y = tableBox.position.y-5;
    table.position.z = tableBox.position.z-8;

    table.rotation.x = -.03;

    scene.remove(tableBox);
    scene.add(table);

    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

    var loader = new THREE.OBJMTLLoader();
    loader.load('obj/Room.obj', '', function(object) {
      //object.position.y = 0;
      //object.position.z = 35;
      //object.position.x = 0;

      var wireframe = new THREE.MeshBasicMaterial({wireframe: true, color: 'grey'});

      object.scale.set(-100, -100, 100);
      object.rotation.set(0, 45*Math.PI/180, 0);
      object.position.set(-120, 300, -750);

      //scene.add(object);

      console.log("Object added to scene");

    }, function(progress){
      console.log(progress);
    }, function(err){
      console.log(err);
    });


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
      geo.position.z = getRandomArbitrary(0, -400);
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
