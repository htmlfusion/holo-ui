function Refrigerator(scene, stereoCamera) {

  var self = this;
  var scene = scene;
  var loaded = false;
  var raycaster = new THREE.Raycaster();
  var center = new THREE.Vector2(0, 0);
  var sphere;
  var pointer;
  var tweens = [];

  var highlightGeo = new THREE.CylinderGeometry(5, 5, 20, 32);
  var highlightMaterial = new THREE.MeshBasicMaterial({
    color: 'white'
  });
  var highlight = new THREE.Mesh(highlightGeo, highlightMaterial);

  var milk = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 20, 32),
    new THREE.MeshBasicMaterial({
      color: 'white'
    }));
  milk.visible = false;


  var createLabel = function(url) {
    var texture = THREE.ImageUtils.loadTexture(url);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    });
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20 / 1.6), material);
    return plane;
  };

  var highlightObject = function(object) {
    highlight.visible = true;
    highlight.position.x = object.position.x;
    highlight.position.y = object.position.y;
    highlight.position.z = object.position.z;
  };

  var unhighlightObject = function(object) {
    highlight.visible = false;
  };

  var showLabel = function(label, object) {
    label.position.x = object.position.x+10;
    label.position.y = object.position.y+20;
    label.position.z = object.position.z;
    var scale = {
      y: 0
    };
    var target = {
      y: 1
    };
    var tween = new TWEEN.Tween(scale).to(target, 1500);
    tween.easing(TWEEN.Easing.Elastic.InOut)
    tween.onUpdate(function() {
      label.scale.y = scale.y;
    });

    tweens.push(tween);
    tween.start();
    tween.onComplete(function() {
      tween.stop();
    })
  };


  var hideLabel = function(label) {
    var scale = {
      y: 1
    };
    var target = {
      y: 0
    };
    var tween = new TWEEN.Tween(scale).to(target, 1500);
    tween.easing(TWEEN.Easing.Elastic.InOut)
    tween.onUpdate(function() {
      label.scale.y = scale.y;
    });

    tweens.push(tween);
    tween.start();
    tween.onComplete(function() {
      tween.stop();
    })
  };

  this.selection = function(time) {

    sphere.material.color.set('yellow');
    raycaster.setFromCamera(center, stereoCamera.proxyCamera);

    // List of selectable objects
    var objects = [sphere];

    objects.forEach(function(obj) {
      var distance = obj.position.distanceTo(stereoCamera.proxyCamera.position)
      obj.scale.x = distance / 400;
      obj.scale.y = distance / 400;
      obj.scale.z = distance / 400;
    });

    var intersects = raycaster.intersectObjects(objects);
    var selectedObjects = []

    for (var i = 0; i < intersects.length; i++) {

      intersects[i].object.material.color.set(0xff0000);
      if (!intersects[i].object.selected && intersects[i].object.onFocus) {
        intersects[i].object.onFocus();
      }
      intersects[i].object.selected = true;
      selectedObjects.push(intersects[i].object);

    }

    objects.forEach(function(obj) {
      if (selectedObjects.indexOf(obj) === -1) {
        if (obj.selected && obj.onBlur) {
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


    scene.add(highlight);
    scene.add(milk);
    milk.position.z = -50;
    milk.position.x = 35;
    milk.position.y = -20;
    var geometry = new THREE.SphereGeometry(50, 32, 32);
    var material = new THREE.MeshBasicMaterial({
      color: 0xffff00
    });
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = milk.position.x;
    sphere.position.y = milk.position.y;
    sphere.position.z = milk.position.z;
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

    setInterval(this.selection, 1000 / 10);;


    var milkLabel = createLabel('./img/milk-info-5.png');
    milkLabel.position.z = -50;
    milkLabel.position.x = 40;
    milkLabel.position.y = -5;
    scene.add(milkLabel);

    sphere.onFocus = function() {
      console.log('sphere selected');
      pointerObj.material.color.set('red');
      showLabel(milkLabel, milk);
      highlightObject(milk);
    }

    sphere.onBlur = function() {
      console.log('sphere unselected');
      pointerObj.material.color.set('white');
      hideLabel(milkLabel);
      unhighlightObject(milk);
    }

    milkLabel.scale.y = 0;
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

      tweens.forEach(function(tween) {
        tween.update(time);
      });

    }


  }

}