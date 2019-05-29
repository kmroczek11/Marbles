class Game {
  constructor() {
    console.log("Konstruktor klasy Game.");
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.createScene();
  }

  createScene() {
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
    this.render();

    var orbitControl = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    orbitControl.addEventListener("change", function() {
      main3d.renderer.render(main3d.scene, main3d.camera);
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
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  createEdges() {
    var singleGeometry = new THREE.Geometry();
    for (let i = 0; i < 4; i++) {
      var edge = new THREE.Mesh(settings.edgeGeometry);
      switch (i) {
        case 0:
          edge.position.set(0, 25, 975);
          break;
        case 1:
          edge.position.set(0, 25, -975);
          break;
        case 2:
          edge.position.set(-975, 25, 0);
          edge.rotation.y = Math.PI / 2;
          break;
        case 3:
          edge.position.set(975, 25, 0);
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
