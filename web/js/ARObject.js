function ARObject(object, scene, url) {

  this.object = object;
  this.label = this.createLabel( url );
  this.group = new THREE.Object3D();
  this.tweens = [];

  var box = new THREE.Box3().setFromObject(this.object);


  var radius = (Math.max(box.size().x, box.size().z)/2)*1.1;

  var highlightGeo = new THREE.CylinderGeometry(radius, radius, box.size().y*1.01, 32);
  var highlightMaterial = new THREE.MeshBasicMaterial({
    color: 'white',
    transparent: true,
    opacity: 0.3
  });

  this.highlighter = new THREE.Mesh(highlightGeo, highlightMaterial);
  this.highlighter.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, box.size().y, 0 ) );
  this.highlighter.position.y = +box.min.y;



  var largestSide = (Math.max.apply(Math.max, box.size().toArray())/2)*1.1;
  var geometry = new THREE.SphereGeometry(largestSide*1.5, 32, 32);
  var material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.5
  });
  this.hotspot = new THREE.Mesh(geometry, material);
  this.hotspot.visible = false;

  this.hotspot.onFocus = function() {

    this.highlight();
    this.showLabel();

  }.bind(this);

  this.hotspot.onBlur = function() {

    this.unhighlight();
    this.hideLabel();

  }.bind(this);


  this.group.add(this.hotspot);
  this.group.add(this.highlighter);
  this.group.add(this.object);
  this.group.add(this.label);

  scene.add(this.group);

  this.play();
};


ARObject.prototype.createLabel = function( url ) {

  var group = new THREE.Object3D();
  var texture = THREE.ImageUtils.loadTexture(url);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.8
  });
  var pointerMaterial = new THREE.MeshBasicMaterial({
    color: 'rgb(200,200,200)',
    transparent: true,
  });

  var plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20 / 1.6), material);
  var sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), pointerMaterial);
  var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.25, .25, 20, 16), pointerMaterial);
  plane.position.x = 4;
  rod.position.x = -10;
  rod.position.y = -5;
  sphere.position.x = -10;
  sphere.position.y = -15;

  group.add(plane);
  group.add(sphere);
  group.add(rod);
  this.label = group;
  return group;

};


ARObject.prototype.unhighlight = function(){
  this.highlighter.scale.y = 0;
  this.highlighter.visible = false;
}

ARObject.prototype.highlight = function() {
  var box = new THREE.Box3().setFromObject(this.object);
  this.highlighter.visible = true;
  // this.highlighter.position.x = this.object.position.x;
  // this.highlighter.position.y = box.min.y;
  // this.highlighter.position.z = this.object.position.z;
  var scale = {
    y: 1
  };
  var target = {
    y: .02
  };
  var tween = new TWEEN.Tween(scale).to(target, 500);
  tween.easing(TWEEN.Easing.Elastic.InOut);

  tween.onUpdate(function() {
    this.highlighter.scale.y = scale.y;
  }.bind(this));

  tween.start();
  tween.onComplete(function() {
    tween.stop();
  });

  this.tweens.push(tween);
};


ARObject.prototype.showLabel = function() {
  var box = new THREE.Box3().setFromObject(this.object);
  this.label.position.x = this.object.position.x + 10;
  this.label.position.y = box.size().y + 10;
  this.label.position.z = this.object.position.z;
  var scale = {
    y: 0
  };
  var target = {
    y: 1
  };
  var tween = new TWEEN.Tween(scale).to(target, 1500);
  tween.easing(TWEEN.Easing.Elastic.InOut);
  tween.onUpdate(function() {
    this.label.scale.y = scale.y;
  }.bind(this));
  tween.delay(500);

  tween.start();
  tween.onComplete(function() {
    tween.stop();
  });
  this.tweens.push(tween);
};


ARObject.prototype.hideLabel = function() {
  var scale = {
    y: 1
  };
  var target = {
    y: 0
  };
  var tween = new TWEEN.Tween(scale).to(target, 1500);
  tween.easing(TWEEN.Easing.Elastic.InOut)
  tween.onUpdate(function() {
    this.label.scale.y = scale.y;
  }.bind(this));
  tween.delay(500);

  this.tweens.push(tween);
  tween.start();
  tween.onComplete(function() {
    tween.stop();
  })
};

ARObject.prototype.play = function(){
  var self = this;
  var reqFrame = function(time){
    setTimeout(function() {
      request = requestAnimationFrame(reqFrame);
      self.tweens.forEach(function(tween) {
        tween.update(time);
      });
    }, 1000/60);
  }

  reqFrame(0);
};
