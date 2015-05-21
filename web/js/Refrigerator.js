function Refrigerator(scene, stereoCamera) {

  var self = this;
  var scene = scene;
  var loaded = false;
  var raycaster = new THREE.Raycaster();
  var center = new THREE.Vector2(0, 0);
  var sphere;
  var pointer;

  this.selection = function(time) {

      sphere.material.color.set('yellow');
      raycaster.setFromCamera(center, stereoCamera.proxyCamera);

      // List of selectable objects
      var objects = [sphere];

      objects.forEach(function(obj) {
        var distance = obj.position.distanceTo(stereoCamera.proxyCamera.position)
        obj.scale.x = distance/400;
        obj.scale.y = distance/400;
        obj.scale.z = distance/400;
      });

      var intersects = raycaster.intersectObjects(objects);
      var selectedObjects = []

      for (var i = 0; i < intersects.length; i++) {

        intersects[i].object.material.color.set(0xff0000);
        if( !intersects[i].object.selected && intersects[i].object.onFocus ){
          intersects[i].object.onFocus();
        }
        intersects[i].object.selected = true;
        selectedObjects.push(intersects[i].object);

      }

      objects.forEach(function(obj) {
        if( selectedObjects.indexOf(obj) === -1){
          if( obj.selected && obj.onBlur ){
            obj.onBlur();
          }
          obj.selected = false;
        }
      });
  };

  this.load = function() {

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
    sphere.visible = false;

    scene.add(sphere);

    var pointerGeo = new THREE.SphereGeometry(2, 32, 32);
    var material = new THREE.MeshLambertMaterial({
      color: 'white'
    });
    pointer = new THREE.Object3D();
    pointerObj = new THREE.Mesh(pointerGeo, material);
    pointerObj.position.z = -200;
    pointer.add(pointerObj);
    scene.add(pointer);

    setInterval(this.selection, 1000/10);;

    sphere.onFocus = function(){
      console.log('sphere selected');
      pointerObj.material.color.set('red');
    }

    sphere.onBlur = function(){
      console.log('sphere unselected');
      pointerObj.material.color.set('white');
    }

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


  }

}