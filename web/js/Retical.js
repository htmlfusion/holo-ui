'use strict';

function Retical(camera, scene, objects) {

  this.camera = camera
  this.group = new THREE.Object3D();
  this.timeout = null;
  this.debounceTimeout = 500;
  this.animationDuration = 250;
  this.reticalDistance = -200;
  this.focusOn = null
  this.objects = objects

  var geometry = new THREE.SphereGeometry( .25, 32, 32 );
  this.material = new THREE.MeshBasicMaterial( { 
    color: 'white', opacity: 0.5, transparent: true,
  });
  
  this.sphere = new THREE.Mesh( geometry, this.material );
  
  var geometry = new THREE.TorusGeometry( 1, .25, 16, 100 );
  this.ring = new THREE.Mesh( geometry, this.material );


  this.sphere.position.z = this.reticalDistance;
  this.ring.position.z = this.reticalDistance;
  this.group.add(this.sphere);
  this.group.add(this.ring);
  
  this.tweens = [];
  scene.add(this.group);
  
  this.toggleFocus(false);
  this.play();
  
  window.onclick = function(){
    
    if(this.focusOn){
      
      if(this.focusOn.object.selected){
        this.focusOn.object.onBlur();
        this.focusOn.object.selected = false;
      } else {
        this.focusOn.object.onFocus();
        this.focusOn.object.selected = true;
      }
      
    }
    
  }.bind(this);
  
};

Retical.prototype.update = function() {
  
  this.group.position.x = this.camera.position.x;
  this.group.position.y = this.camera.position.y;
  this.group.position.z = this.camera.position.z;
  
  this.group.rotation.x = this.camera.rotation.x;
  this.group.rotation.y = this.camera.rotation.y;
  this.group.rotation.z = this.camera.rotation.z;
  
  
  if(this.focusOn){
    var distance = this.camera.position.distanceTo(this.focusOn.point);
    this.ring.position.z = -distance;
    this.sphere.position.z = -distance;
  }
  
};

Retical.prototype.focus = function(object) {
  this.focusOn = object;
  this.hasFocus = true;
  if(this.timeout){
    clearTimeout(this.timeout);
  }
  this.timeout = setTimeout(function(){
    this.timeout = null;
    this.toggleFocus(true);
    //this.focusOn.object.onFocus();
  }.bind(this), this.debounceTimeout);
  
};

Retical.prototype.blur = function(){
  this.hasFocus = false;
  if(this.timeout){
    clearTimeout(this.timeout);
  }
  this.timeout = setTimeout(function(){
    this.toggleFocus(false);
    this.timeout = null;
    //this.focusOn.object.onBlur();
  }.bind(this), this.debounceTimeout);
};
  
Retical.prototype.toggleFocus = function(show){
  
  var targetScale = 0;
  var targetOpacity = 1;
  var targetDistance;
  if(this.focusOn){
    targetDistance = -this.focusOn.distance+10;
  } else {
    targetDistance = this.reticalDistance;
  }
  
  if(show){
    targetScale = 1;
    targetOpacity = .3;
    targetDistance = -this.focusOn.distance+10;
  }
  
  var target = {
    scale: this.ring.scale.x,
    opacity: this.material.opacity,
    distance: this.ring.position.z
  };
  
  var tween = new TWEEN.Tween(target).to({
    scale: targetScale,
    opacity: targetOpacity,
    distance: targetDistance
  }, this.animationDuration);
  
  tween.easing(TWEEN.Easing.Quadratic.InOut);
  tween.onUpdate(function() {
    this.ring.scale.x = target.scale;
    this.ring.scale.y = target.scale;
    this.ring.scale.z = target.scale;
    
    // this.ring.position.z = target.distance;
    // this.sphere.position.z = target.distance;
    this.material.opacity = target.opacity;
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
