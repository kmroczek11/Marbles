class Game {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.marbleForShooting = null;
    this.strikedMarble = null;
    this.directionArrow = null;
    this.directionVect = null;
    this.mouseVector = null;
    this.lastWall = ''
    this.collidableElementsArray = [];
    this.launched = false;
    this.frame = 0
    this.shots = 0
    this.initThree();
    this.shoot();
  }

  initThree() {
    //scena i kamera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      $(window).width() / $(window).height(),
      0.1,
      10000
    );

    //renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x444444);
    this.renderer.setSize($(window).width(), $(window).height());
    //this.renderer.shadowMap.enabled = true;
    //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    $("#root").append(this.renderer.domElement);

    //osie
    //var axes = new THREE.AxesHelper(1000);
    //axes.position.set(0, 25, 0); //podniesienie osi, aby były widoczne
    //this.scene.add(axes);

    this.camera.position.set(0, 1900, 1700);
    this.camera.lookAt(this.scene.position);

    //światła
    var ambient = new THREE.AmbientLight(0x222222);
    this.scene.add(ambient);
    //var light = new THREE.SpotLight(0xffffff);
    //light.position.set(10, 30, 20);
    //light.target.position.set(0, 0, 0);
    //this.scene.add(light);
    this.scene.add(new Light(0, 2500, 0, 5000));

    //stworzenie podłogi
    var platform = new THREE.Mesh(
      settings.platformGeometry,
      settings.platformMaterial
    );
    platform.rotation.x = Math.PI / 2;
    platform.castShadow = false;
    platform.receiveShadow = true;
    platform.name = "platform";
    this.scene.add(platform);

    //stworzenie kulki do strzelania
    this.resetMarbleForShooting();

    //stworzenie raycastera
    this.raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
    this.mouseVector = new THREE.Vector2(); // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie a potem przeliczenia na pozycje 3D

    this.animate();
    this.resizeWindow();
    this.createEdges();
    this.stats()
  }

  resetMarbleForShooting() {
    this.marbleForShooting = new Marble(0, 100, 900);
    //this.marbleForShooting.name = "marbleForShooting";
    this.scene.add(this.marbleForShooting);

  }

  stats() {
    var script = document.createElement("script");
    script.onload = function () {
      var stats = new Stats();
      document.body.appendChild(stats.dom);
      requestAnimationFrame(function loop() {
        stats.update();
        requestAnimationFrame(loop);
      });
    };
    script.src = "//mrdoob.github.io/stats.js/build/stats.min.js";
    document.head.appendChild(script);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.frame++
    if (this.launched) {
      this.marbleForShooting.translateOnAxis(this.directionVect, 80);
      this.marbleForShooting.position.y = 100;
      this.checkMarbleCollision()
    }
    this.renderer.render(this.scene, this.camera);
  }

  resizeWindow() {
    $(window).on("resize", function () {
      game.camera.aspect = window.innerWidth / window.innerHeight;
      game.camera.updateProjectionMatrix();
      game.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  createEdges() {
    this.edge1 = new THREE.Mesh(settings.edgeGeometry, settings.edgeMaterial);
    this.edge1.position.set(-1200, 200, 0);
    this.edge1.rotation.y = Math.PI / 2;
    this.scene.add(this.edge1);

    this.edge2 = new THREE.Mesh(settings.edgeGeometry, settings.edgeMaterial);
    this.edge2.position.set(1300, 200, 0);
    this.edge2.rotation.y = Math.PI / 2;
    this.scene.add(this.edge2);
  }

  shoot() {
    $(document).mousemove(function (event) {
      if (!game.launched) {
        if (game.directionArrow != null)
          //usuwanie strzałki
          game.scene.remove(
            game.scene.getObjectByName(game.directionArrow.name)
          );
        game.updateDirectionVector()
        var matrix = new THREE.Matrix4();
        matrix.extractRotation(game.marbleForShooting.matrix);

        var marbleDirection = new THREE.Vector3(0, 0, 1);
        marbleDirection.applyMatrix4(matrix);

        // var marbleDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
        //   game.marbleForShooting.quaternion
        // );
        var length = 1000;
        var hex = 0xffff00;
        var dir = game.directionVect.clone()
        dir.y = 0
        game.directionArrow = new THREE.ArrowHelper(
          dir,
          marbleDirection,
          length,
          hex
        );
        game.directionArrow.name = "directionArrow";
        game.directionArrow.position.set(0, 100, 900);
        game.scene.add(game.directionArrow);
      }
    });
    $(document).mousedown(function (event) {
      if (!game.launched)
        game.updateDirectionVector()
      game.launched = true;
    });
  }

  updateDirectionVector() {
    this.mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
    this.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
    this.raycaster.setFromCamera(this.mouseVector, this.camera)
    var intersects = game.raycaster.intersectObjects(this.scene.children);
    if (intersects.length > 0) {
      this.clickedVect = intersects[0].point;
      this.directionVect = this.clickedVect
        .clone()
        .sub(this.marbleForShooting.position)
        .normalize();
    }
  }

  checkMarbleCollision() {
    var wallWidth = this.edge1.geometry.parameters.depth
    if (this.marbleForShooting.position.x < this.edge1.position.x + wallWidth / 2
      || this.marbleForShooting.position.x > this.edge2.position.x - wallWidth / 2)
      this.onWallCollision()
    var marbleWidth = this.marbleForShooting.geometry.parameters.radius
    marbles.each(function (marble, row, col) {
      if (game.marbleForShooting.position.distanceTo(marble.position) < marbleWidth * 2) {
        marbles.handleCollision(game.marbleForShooting, marble, row, col)
        game.onMarbleCollision()
      }
    })
  }

  onWallCollision() {
    this.directionVect.x = -this.directionVect.x;
  }

  onMarbleCollision() {
    this.shots++
    this.launched = false

    this.resetMarbleForShooting()
    if (this.shots % 5 == 0)
      marbles.addRow()

  }
}
