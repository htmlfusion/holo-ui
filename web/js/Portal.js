function Portal(object, scene, url) {

  this.object = object;
  
  var largestSide = (Math.max.apply(Math.max, box.size().toArray())/2)*1.1;
  var geometry = new THREE.SphereGeometry(largestSide*1.5, 32, 32);
  var material = new THREE.MeshBasicMaterial({
    color: 'black',
  });
  
  this.container = new THREE.Mesh(geometry, material);

  this.group.add(this.container);
  this.tweens = [];
  scene.add(this.group);
  this.play();
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
