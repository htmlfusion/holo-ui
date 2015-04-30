function earthDemoLight(scene) {

  var self = this;
  var scene = scene;
  var clouds, earth;

  this.load = function() {
    //clouds object

    var cloud_material = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('img/clouds-low.png'),
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
      new THREE.SphereGeometry(6 + .1, 80, 80),
      cloud_material
    )

    clouds.position.set(0, 0, 0)
    clouds.receiveShadow = true
    clouds.castShadow = true
    //scene.add( clouds )

    //earth object  specular: 0x555555, 
    var earthBumpImage = THREE.ImageUtils.loadTexture("img/earth-bump-low.jpg");
    var geometry = new THREE.SphereGeometry(6, 80, 80)
    var material = new Physijs.createMaterial(
      new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('img/earth-low.jpg'),
        ambient: 0x050505,
        color: 0xFFFFFF,
        specular: 0xFFFFFF,
        specularMap: THREE.ImageUtils.loadTexture('img/earth-specular-low.png'),
        bumpMap: earthBumpImage,
        bumpScale: .005,
        metal: true
      }),
      0.9,
      0.5);

    earth = new Physijs.BoxMesh(geometry, material, 1);
    earth.position.set(0, 0, 70);
    earth.name = "Earth";
    
    earth.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
      console.log('collision from Physijs');
    // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
    });
    
    earth.add(clouds);
    scene.add(earth);

  }

  this.animate = function(){
    rotate_right();
  }

  var rotate_right = function() {
    clouds.rotation.y += .001;
    earth.rotation.y += .001;
    
  }

  if (scene.name === 'earthLight') {
    this.load();
  }

}
