'use strict';

function Retical(camera, scene) {

  this.camera = camera
  this.group = new THREE.Object3D();
  this.timeout = null;
  this.debounceTimeout = 500;
  this.animationDuration = 250;

  var geometry = new THREE.SphereGeometry( .25, 32, 32 );
  this.material = new THREE.MeshBasicMaterial( { 
    color: 'white', opacity: 0.5, transparent: true,
  });
  
  this.sphere = new THREE.Mesh( geometry, this.material );
  
  var geometry = new THREE.TorusGeometry( 1, .25, 16, 100 );
  this.ring = new THREE.Mesh( geometry, this.material );


  this.sphere.position.z = -200;
  this.ring.position.z = -200;
  this.group.add(this.sphere);
  this.group.add(this.ring);
  
  this.tweens = [];
  scene.add(this.group);
  
  this.toggleFocus(false);
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
  if(this.timeout){
    clearTimeout(this.timeout);
  }
  this.timeout = setTimeout(function(){
    this.timeout = null;
    this.toggleFocus(true);
  }.bind(this), this.debounceTimeout);
}

Retical.prototype.blur = function(){
  this.hasFocus = false;
  if(this.timeout){
    clearTimeout(this.timeout);
  }
  this.timeout = setTimeout(function(){
    this.toggleFocus(false);
    this.timeout = null;
  }.bind(this), this.debounceTimeout);
}
  
Retical.prototype.toggleFocus = function(show){
  
  var scale = {
    y: 1,
    opacity: 1
  };
  
  var target = {
    y: 0,
    opacity: 0.2
  };
  
  if(show){
    target.y = 1;
    scale.y = 0;
    target.opacity = 1;
    scale.opacity = 0.2;
  }
  
  var tween = new TWEEN.Tween(scale).to(target, this.animationDuration);
  tween.easing(TWEEN.Easing.Quadratic.InOut);
  tween.onUpdate(function() {
    console.log(show);
    console.log(scale.y);
    this.ring.scale.x = scale.y;
    this.ring.scale.y = scale.y;
    this.ring.scale.z = scale.y;
    this.material.opacity = scale.opacity;
  }.bind(this));

  tween.start();
  tween.onComplete(function() {
    tween.stop();
    var index = this.tweens.indexOf(tween);
    if(index!==-1){
      this.tweens.splice(index, 1);
    }
  }.bind(this));
  this.tweens.push(tween);
};


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
