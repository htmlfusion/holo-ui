function earthDemo(scene) {

  var self = this;
  var scene = scene;
  var clouds, earth;
  var loaded = false;
  var radius = 12;

  this.load = function() {
    loaded = true;
    //clouds object

    var cloud_material = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('img/clouds-high.png'),
        transparent: true,
        blending: THREE.CustomBlending,
        blendSrc: THREE.SrcAlphaFactor,
        blendDst: THREE.OneMinusSrcColorFactor,
        blendEquation: THREE.AddEquation
      }),
      0.9,
      0.5
    );



    clouds = new Physijs.BoxMesh(
      new THREE.SphereGeometry(radius + .1, 80, 80),
      cloud_material
    );

    clouds.position.set(0, 0, 0)
    clouds.receiveShadow = true
    clouds.castShadow = true
    //scene.add( clouds )


    //earth object  specular: 0x555555, 
    var earthBumpImage = THREE.ImageUtils.loadTexture("img/earth-bump-high.jpg");
    var geometry = new THREE.SphereGeometry(radius, 80, 80)
    var material = new Physijs.createMaterial(
      new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('img/earth-high.jpg'),
        ambient: 0x050505,
        color: 0xFFFFFF,
        specular: 0xFFFFFF,
        specularMap: THREE.ImageUtils.loadTexture('img/earth-specular-high.png'),
        bumpMap: earthBumpImage,
        bumpScale: .005,
        metal: true
      }),
      0.9,
      0.5);

    earth = new Physijs.BoxMesh(geometry, material, 0);
    earth.position.set(0, 10, 20);

    earth.add(clouds);
    scene.add(earth);

  }

  this.animate = function(){
    if(loaded){
      rotate_right();
    }
  }

  var rotate_right = function() {
    clouds.rotation.y += .001;
    earth.rotation.y += .001;
  }

  if (scene.name === 'Earth') {
    this.load();
  }

}