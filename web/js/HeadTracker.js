navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia || navigator.msGetUserMedia;

function startCamera(videoElem, cb){
  navigator.getUserMedia({video: true}, function( stream ) {
    videoElem[0].src = (window.URL && window.URL.createObjectURL(stream)) || stream;
    videoElem[0].play();
    cb(videoElem);
  }, function(err) {
    cb(videoElem, err);
    window.alert('An error occured which starting the camera.');
  });
};

function startTracking(cb){
  var videoElem = $('#capture');
  var ctrack = new clm.tracker({useWebGL : true});
  ctrack.init(pModel);
  startCamera(videoElem, function(vid, err){
    if(!err){
      ctrack.start(vid[0]);
      cb(ctrack);
    } else {
      cb(null, err);
    }
  });
};


function HeadTracker(){
  
  var self=this;
  
  self.initialized = false;
  self.tracker = null;
  self.fov = 25*Math.PI/180.0;
  self.eyeWidth = 62;
  
  this.initTracker = function(){
    startTracking(function(tracker, err){
      self.tracker = tracker;
      if(!err){
        self.initialized = true;
      }
    });
  };
  
  this.getPose = function(){
    var rightEyeRaw = self.tracker.getCurrentPosition()[32];
    var leftEyeRaw = self.tracker.getCurrentPosition()[27];
    
    var rightEye = [
      0.5-rightEyeRaw[0]/640,
      0.5-rightEyeRaw[1]/480
    ];
    
    var leftEye = [
      0.5-leftEyeRaw[0]/640,
      0.5-leftEyeRaw[1]/480
    ];
    
    var dx = leftEye[0]-rightEye[0];
    var dy = leftEye[1]-rightEye[1];
    var dist = Math.sqrt(dx * dx + dy * dy);
    
    var angle = self.fov * dist / 2.0;
    var headDist = (self.eyeWidth/ 2.0) / Math.tan(angle);
    
    var centerX = (leftEye[0]+rightEye[0])/2.0;
    var centerY = (leftEye[1]+rightEye[1])/2.0;
    
    var rx = Math.sin(self.fov * centerX) * headDist * 0.5;
    var ry = Math.sin(self.fov * centerY) * headDist * 1.5;

    var fx = rx;
    var fy = ry;
    var fz = headDist;
    
    var vec = [fx, fy, fz];
    return vec;
    //Pupil distance this is an average pupile distance in mm
  };
  
}

