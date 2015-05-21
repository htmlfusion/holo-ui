function Refrigerator(scene, stereoCamera) {

  var self = this;
  var scene = scene;
  var spotLight = scene.getObjectByName('lamp');
  var loaded = false;
  var raycaster = new THREE.Raycaster();
  var center = new THREE.Vector2(0, 0);
  var sphere;

  this.selection = function(time) {

      sphere.material.color.set('yellow');
      raycaster.setFromCamera(center, stereoCamera.proxyCamera);

      // calculate objects intersecting the picking ray
      var objects = [sphere];
      objects.forEach(function(obj) {
        obj.selected = false;
        obj.material.color.set('yellow');
        var distance = obj.position.distanceTo(stereoCamera.proxyCamera.position)
        obj.scale.x = distance/400;
        obj.scale.y = distance/400;
        obj.scale.z = distance/400;
      });

      var intersects = raycaster.intersectObjects(objects);

      for (var i = 0; i < intersects.length; i++) {

        intersects[i].object.material.color.set(0xff0000);
        intersects[i].object.selected = true;

      }
  };

  this.load = function() {

    spotLight.castShadow = true;

    //spotLight.shadowDarkness = 0.5;
    spotLight.shadowMapWidth = 1024 * 8;
    spotLight.shadowMapHeight = 1024 * 8;

    spotLight.position.x = 60;
    spotLight.shadowCameraNear = 5;
    spotLight.shadowCameraFov = 120;
    spotLight.target.position.set(0, 5, -50);

    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

    // var loader = new THREE.OBJMTLLoader();
    // loader.load('obj/full-room-modeled.obj', '', function(object) {

    //   var wireframe = new THREE.MeshBasicMaterial({
    //     wireframe: true,
    //     color: 'grey'
    //   });

    //   var children = object.children;
    //   object.children = [];
    //   children.forEach(function(child) {

    //     var rigidMaterial = Physijs.createMaterial(
    //       wireframe,
    //       .8,
    //       .3
    //     );

    //     // Ground
    //     var childObject = new Physijs.ConvexMesh(
    //       child.geometry,
    //       rigidMaterial,
    //       0 // mass
    //     );

    //     object.add(childObject);
    //     //scene.add(childObject);
    //   });

    //   object.rotation.set(-2 * Math.PI / 180, -95 * Math.PI / 180, 0);
    //   object.position.y = 5;
    //   scene.add(object);

    //   console.log("Object added to scene");

    // }, function(progress) {
    //   console.log(progress);
    // }, function(err) {
    //   console.log(err);
    // });


    var geometry = new THREE.SphereGeometry(100, 32, 32);
    var material = new THREE.MeshBasicMaterial({
      color: 0xffff00
    });
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.z = -60;
    sphere.position.x = 40;
    sphere.position.y = -20;
    scene.add(sphere);

    setInterval(this.selection, 1000/10);;


    // leapFrame = 0;
    // Leap.loop(function(frame) {
    //   frame.hands.forEach(function(hand, index) {
    //     if (hand.grabStrength === 0 && leapFrame % 12 === 0) {
    //       var geo = new Physijs.SphereMesh(
    //         new THREE.SphereGeometry(4, 40, 40),
    //         new THREE.MeshPhongMaterial({
    //           color: 'yellow'
    //         })
    //       );
    //       geo.receiveShadow = true;
    //       geo.position.set(hand.palmPosition[0] / 10 - 10, hand.palmPosition[1] / 10 - 30, hand.palmPosition[2] / 10 + 25);
    //       scene.add(geo);
    //       geo.setLinearVelocity(new THREE.Vector3(0, 0, -50));
    //       leapFrame = 0;
    //     }
    //   });
    //   leapFrame++;
    // });


    loaded = true;
  }


  if (scene.name === 'refrigerator') {
    this.load();
  }





  this.animate = function(time) {
    if (loaded) {

    }


  }

}