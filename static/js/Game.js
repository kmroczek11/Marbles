class Game {
  constructor() {
    console.log("Konstruktor klasy Game.");
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.world = null;
    this.sphereBody = null;
    this.groundBody = null;
    this.timeStep = 1 / 60;
    this.mesh = null;
    this.initThree();
    this.initCannon();
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      $(window).width() / $(window).height(),
      0.1,
      10000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0xffffff);
    this.renderer.setSize($(window).width(), $(window).height());
    $("#root").append(this.renderer.domElement);
    var axes = new THREE.AxesHelper(1000);
    axes.position.set(0, 25, 0); //podniesienie osi, aby były widoczne
    this.scene.add(axes);
    this.camera.position.set(0, 2500, 2500);
    this.camera.lookAt(this.scene.position);

    var orbitControl = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    orbitControl.addEventListener("change", function() {
      game.renderer.render(game.scene, game.camera);
    });

    $(window).on("resize", function() {
      game.camera.aspect = window.innerWidth / window.innerHeight;
      game.camera.updateProjectionMatrix();
      game.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    var platform = new THREE.Mesh(
      settings.platformGeometry,
      settings.platformMaterial
    );
    platform.rotation.x = Math.PI / 2;
    this.scene.add(platform);
    this.createEdges();

    var geometry = new THREE.BoxGeometry(2, 2, 2);
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.updatePhysics();
    this.renderer.render(this.scene, this.camera);
  }

  initCannon() {
    //stworzenie świata
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, -9.82); //ustawiamy grawitację
    this.world.broadphase = new CANNON.NaiveBroadphase(); //służy do odnajdowania kolidujących obiektów

    //stworzenie kulki do strzelania
    var mass = 5,
      radius = 1;
    var sphereShape = new CANNON.Sphere(radius);
    this.sphereBody = new CANNON.Body({ mass: mass, shape: sphereShape });
    this.sphereBody.position.set(0, 0, 0);
    this.world.add(this.sphereBody);

    //dodanie podłogi
    var groundShape = new CANNON.Plane(); //podłoga dla świata
    this.groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
    this.world.add(this.groundBody);
  }

  updatePhysics() {
    //ustawienie odświeżania
    this.world.step(this.timeStep);

    // console.log(
    //   this.sphereBody.position.x,
    //   this.sphereBody.position.y,
    //   this.sphereBody.position.z
    // );
  }

  createEdges() {
    var singleGeometry = new THREE.Geometry();
    for (let i = 0; i < 4; i++) {
      var edge = new THREE.Mesh(settings.edgeGeometry);
      switch (i) {
        case 0:
          edge.position.set(0, 100, 990);
          break;
        case 1:
          edge.position.set(0, 100, -990);
          break;
        case 2:
          edge.position.set(-990, 100, 0);
          edge.rotation.y = Math.PI / 2;
          break;
        case 3:
          edge.position.set(990, 100, 0);
          edge.rotation.y = Math.PI / 2;
          break;
      }
      edge.updateMatrix(); // bez tego pozycja geometrii jest zawsze 0,0,0
      singleGeometry.merge(edge.geometry, edge.matrix);
    }
    var edges = new THREE.Mesh(singleGeometry, settings.edgeMaterial);
    this.scene.add(edges);
  }
}
