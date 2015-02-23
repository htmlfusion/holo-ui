function earthDemo(scene) {

  var self = this;
  var scene = scene;
  var clouds, earth;

  this.load = function() {
    //clouds object

    var cloud_material = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('img/clouds.jpg'),
        transparent: true,
        blending: THREE.CustomBlending,
        blendSrc: THREE.SrcAlphaFactor,
        blendDst: THREE.OneMinusSrcColorFactor,
        blendEquation: THREE.AddEquation
      }),
      0.9,
      0.5);



    clouds = new Physijs.BoxMesh(
      new THREE.SphereGeometry(6 + 1, 4, 4),
      cloud_material
    )

    clouds.position.set(0, 0, 0)
    clouds.receiveShadow = true
    clouds.castShadow = true
    //scene.add( clouds )


    //earth object  specular: 0x555555, 
    var earthBumpImage = THREE.ImageUtils.loadTexture("img/earthBumpMap.jpg");
    var geometry = new THREE.SphereGeometry(6, 5, 5)
    var material = new Physijs.createMaterial(
      new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('img/earthSatTexture.jpg'),
        ambient: 0x050505,
        color: 0xFFFFFF,
        specular: 0xFFFFFF,
        bumpMap: earthBumpImage,
        bumpScale: 19,
        metal: true
      }),
      0.9,
      0.5);

    earth = new Physijs.BoxMesh(geometry, material, 0);
    earth.position.set(0, 0, 70);

    earth.add(clouds);
    scene.add(earth);

  }

  var rotate_right = function() {
    clouds.rotation.y += .002;
    earth.rotation.y += .001;
  }

  if (scene.name === 'Earth') {
    this.load();
  }

}