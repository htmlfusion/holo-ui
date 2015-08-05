function Retical(camera, scene) {

  this.camera = camera
  this.group = new THREE.Object3D();

  var geometry = new THREE.SphereGeometry( 5, 32, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 'white' } );
  this.sphere = new THREE.Mesh( geometry, material );
  
  var geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
  var material = new THREE.MeshBasicMaterial( { color: 'white' } );
  this.ring = new THREE.Mesh( geometry, material );


  this.sphere.position.z = -200;
  this.ring.position.z = -200;
  this.group.add(this.sphere);
  this.group.add(this.ring);
  
  this.tweens = [];
  scene.add(this.group);
  
  this.hasFocus = false;
  this.play();
};

Retical.prototype.update = function() {
  
  this.group.position.x = this.camera.position.x;
  this.group.position.y = this.camera.position.y;
  this.group.position.z = this.camera.position.z;
  
  this.group.rotation.x = this.camera.rotation.x;
  this.group.rotation.y = this.camera.rotation.y;
  this.group.rotation.z = this.camera.rotation.z;
  
};

Retical.prototype.focus = function(){
  
  this.hasFocus = true;
  var scale = {
    y: 0
  };
  var target = {
    y: 1
  };
  var tween = new TWEEN.Tween(scale).to(target, 1500);
  tween.easing(TWEEN.Easing.Elastic.InOut);
  tween.onUpdate(function() {
    this.ring.scale.x = scale.y;
    this.ring.scale.y = scale.y;
    this.ring.scale.z = scale.y;
  }.bind(this));
  tween.delay(500);

  tween.start();
  tween.onComplete(function() {
    tween.stop();
  });
  this.tweens.push(tween);
}

Retical.prototype.blur = function(){
  this.hasFocus = false;
  var scale = {
    y: 1
  };
  var target = {
    y: 0
  };
  var tween = new TWEEN.Tween(scale).to(target, 1500);
  tween.easing(TWEEN.Easing.Elastic.InOut);
  tween.onUpdate(function() {
    this.ring.scale.x = scale.y;
    this.ring.scale.y = scale.y;
    this.ring.scale.z = scale.y;
  }.bind(this));
  tween.delay(500);

  tween.start();
  tween.onComplete(function() {
    tween.stop();
  });
  this.tweens.push(tween);
}


Retical.prototype.play = function(){
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
