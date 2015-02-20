'use strict';


function LeftHand(scene){

  var self=this;
  
  var renderer = renderer;
  var scene = scene;
  var group = group;
  
  var left = scene.getObjectByName('LeftHand');

  self.setPosition = function(position){
    left.position.x = -position[0]/10;
    left.position.y = position[1]/10;
    left.position.z = position[2]/10;
  };

}


function RightHand(scene){

  var self=this;
  
  var renderer = renderer;
  var scene = scene;
  var group = group;
  
  var right = scene.getObjectByName('RightHand');


  self.setPosition = function(position){
    right.position.x = -position[0]/10;
    right.position.y = position[1]/10;
    right.position.z = position[2]/10;
  };


}
