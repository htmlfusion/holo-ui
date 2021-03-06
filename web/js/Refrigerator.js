function Refrigerator(scene, stereoCamera) {

  var self = this;
  var scene = scene;
  var loaded = false;
  var raycaster = new THREE.Raycaster();
  var center = new THREE.Vector2(0, 0);
  var pointer;
  var objects = [];

  this.selection = function(time) {

    raycaster.setFromCamera(center, stereoCamera.proxyCamera);

    var hotspots = objects.map(function(o){ return o.hotspot; });

    // List of selectable objects
    hotspots.forEach(function(obj) {
      var distance = obj.position.distanceTo(stereoCamera.proxyCamera.position)
      obj.material.color.set('yellow');
      // obj.scale.x = distance / 800;
      // obj.scale.y = distance / 800;
      // obj.scale.z = distance / 800;
    });

    var intersects = raycaster.intersectObjects(hotspots);
    var selectedObjects = []

    for (var i = 0; i < intersects.length; i++) {

      intersects[i].object.material.color.set(0xff0000);
      if (!intersects[i].object.selected && intersects[i].object.onFocus) {
        intersects[i].object.onFocus();
      }
      intersects[i].object.selected = true;
      selectedObjects.push(intersects[i].object);

    }

    hotspots.forEach(function(obj) {
      if (selectedObjects.indexOf(obj) === -1) {
        if (obj.selected && obj.onBlur) {
          obj.onBlur();
        }
        obj.selected = false;
      }
    });
  };

  this.load = function() {

    /*
      Milk Object
     */
    var milk = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 17.78, 32),
      new THREE.MeshBasicMaterial({
        color: 'black'
      }));

    var milkAnnotation = new ARObject(milk, scene, './img/milk-info-5.png');
    milkAnnotation.group.position.z = -50;
    milkAnnotation.group.position.x = 35;
    milkAnnotation.group.position.y = -23.5;
    objects.push(milkAnnotation);

    /*
      Milk Object
     */
    var tea = new THREE.Mesh(new THREE.CylinderGeometry(10.795/2, 10.795/2, 20.32, 32),
      new THREE.MeshBasicMaterial({
        color: 'black'
      }));

    /*
      Tea Object
     */
    var tea = new THREE.Mesh(new THREE.CylinderGeometry(10.795/2, 10.795/2, 20.32, 32),
      new THREE.MeshBasicMaterial({
        color: 'black'
      }));

    var teaAnnotation = new ARObject(tea, scene, './img/tea.png');
    teaAnnotation.group.position.z = -50;
    teaAnnotation.group.position.x = -35;
    teaAnnotation.group.position.y = -28;
    objects.push(teaAnnotation);

    /*
      Champaign Object
     */
    var champaign = new THREE.Mesh(new THREE.CylinderGeometry(10.16/2, 10.16/2, 31.75, 32),
      new THREE.MeshBasicMaterial({
        color: 'black'
      }));

    var champaignAnnotation = new ARObject(champaign, scene, './img/champaign.png');
    champaignAnnotation.group.position.z = -40;
    champaignAnnotation.group.position.x = -50;
    champaignAnnotation.group.position.y = -22;
    objects.push(champaignAnnotation);

    /*
      Coffee Object
     */
    var coffee = new THREE.Mesh(new THREE.BoxGeometry(17.78, 7.62, 10.16, 32),
      new THREE.MeshBasicMaterial({
        color: 'black'
      }));

    var coffeeAnnotation = new ARObject(coffee, scene, './img/coffee.png');
    coffeeAnnotation.group.position.z = -34;
    coffeeAnnotation.group.position.x = 8;
    coffeeAnnotation.group.position.y = -33;
    objects.push(coffeeAnnotation);

    /*
      Pointer Object and setup
     */
    var pointerGeo = new THREE.SphereGeometry(2, 32, 32);
    var material = new THREE.MeshLambertMaterial({
      color: 'white',
      transparent: true,
      opacity: 0.5
    });

    pointer = new THREE.Object3D();
    pointerObj = new THREE.Mesh(pointerGeo, material);
    pointerObj.position.z = -200;
    pointer.add(pointerObj);
    scene.add(pointer);

    setInterval(this.selection, 1000 / 10);;

    loaded = true;
  }


  if (scene.name === 'refrigerator') {
    this.load();
  }

  this.animate = function(time) {
    if (loaded) {
      pointer.position.x = stereoCamera.proxyCamera.position.x;
      pointer.position.y = stereoCamera.proxyCamera.position.y;
      pointer.position.z = stereoCamera.proxyCamera.position.z;

      pointer.rotation.x = stereoCamera.proxyCamera.rotation.x;
      pointer.rotation.y = stereoCamera.proxyCamera.rotation.y;
      pointer.rotation.z = stereoCamera.proxyCamera.rotation.z;

    }
  };

}