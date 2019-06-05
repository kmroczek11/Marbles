class Game {
  constructor() {
    console.log("Konstruktor klasy Game.");
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.marbleForShooting = null;
    this.initThree();
    this.animate();
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
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0xffffff);
    this.renderer.setSize($(window).width(), $(window).height());
    $("#root").append(this.renderer.domElement);

    //osie
    var axes = new THREE.AxesHelper(1000);
    axes.position.set(0, 25, 0); //podniesienie osi, aby były widoczne
    this.scene.add(axes);
    this.camera.position.set(0, 2500, 2500);
    this.camera.lookAt(this.scene.position);

    //światła
    var ambient = new THREE.AmbientLight(0x111111);
    this.scene.add(ambient);
    var light = new THREE.SpotLight(0xffffff);
    light.position.set(10, 30, 20);
    light.target.position.set(0, 0, 0);
    this.scene.add(light);

    //orbitControl
    var orbitControl = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    orbitControl.addEventListener("change", function() {
      game.renderer.render(game.scene, game.camera);
    });

    //stworzenie podłogi
    var platform = new THREE.Mesh(
      settings.platformGeometry,
      settings.platformMaterial
    );
    platform.rotation.x = Math.PI / 2;
    platform.castShadow = true;
    platform.receiveShadow = true;
    platform.name = "platform";
    this.scene.add(platform);

    //stworzenie kulki do strzelania
    this.marbleForShooting = new THREE.Mesh(
      settings.marbleGeometry,
      settings.marbleMaterial
    );
    this.marbleForShooting.castShadow = true;
    this.marbleForShooting.receiveShadow = true;
    this.marbleForShooting.position.set(0, 100, 900);
    this.marbleForShooting.name = "marbleForShooting";
    this.scene.add(this.marbleForShooting);

    //stworzenie raycastera
    this.raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
    this.mouseVector = new THREE.Vector2(); // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie a potem przeliczenia na pozycje 3D

    this.resizeWindow();
    this.createEdges();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    if (this.directionVect != null) {
      this.marbleForShooting.translateOnAxis(this.directionVect, 20); // 5 - przewidywany speed
      this.marbleForShooting.position.y = 100;
      this.checkIfCollides();
    }
    this.renderer.render(this.scene, this.camera);
  }

  resizeWindow() {
    $(window).on("resize", function() {
      game.camera.aspect = window.innerWidth / window.innerHeight;
      game.camera.updateProjectionMatrix();
      game.renderer.setSize(window.innerWidth, window.innerHeight);
    });
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
    edges.name = "wall";
    this.scene.add(edges);
  }

  shoot() {
    $(document).mousedown(function(event) {
      game.mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
      game.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
      game.raycaster.setFromCamera(game.mouseVector, game.camera);
      var intersects = game.raycaster.intersectObjects(game.scene.children);
      if (intersects.length > 0) {
        console.log("Trafiono w ", intersects[0].object.name);
        game.clickedVect = intersects[0].point;
        // console.log("Wektor klikniętego punktu ", game.clickedVect);
        game.directionVect = game.clickedVect
          .clone()
          .sub(game.marbleForShooting.position)
          .normalize();
        // console.log("Wektor kierunkowy ", game.directionVect);
        //funkcja normalize() przelicza współrzędne x,y,z wektora na zakres 0-1
        //jest to wymagane przez kolejne funkcje
      }
    });
  }

  checkIfCollides() {
    var mainMarble = this.marbleForShooting;
    var ray = new THREE.Raycaster();
    for (
      var vertexIndex = 0;
      vertexIndex < mainMarble.geometry.vertices.length;
      vertexIndex++
    ) {
      var localVertex = mainMarble.geometry.vertices[vertexIndex].clone();
      var globalVertex = localVertex.applyMatrix4(mainMarble.matrix);
      var directionVector = globalVertex.sub(mainMarble.position);

      ray.set(mainMarble.position, directionVector.clone().normalize());

      var collisionResults = ray.intersectObjects(
        marbles.collidableMarblesList
      );
      if (
        collisionResults.length > 0 &&
        collisionResults[0].distance < directionVector.length()
      ) {
        // a collision occurred... do something...
        console.log(collisionResults[0].object.name);
        alert("Kolizja");
      }
    }
  }
}
