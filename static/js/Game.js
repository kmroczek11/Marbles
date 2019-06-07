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
    this.collidableElementsArray = [];
    this.launched = false;
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
    platform.castShadow = false;
    platform.receiveShadow = true;
    platform.name = "platform";
    this.scene.add(platform);

    //stworzenie kulki do strzelania
    this.createMarbleForShooting();

    //stworzenie raycastera
    this.raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
    this.mouseVector = new THREE.Vector2(); // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie a potem przeliczenia na pozycje 3D

    this.animate();
    this.resizeWindow();
    this.createEdges();
  }

  createMarbleForShooting() {
    this.marbleForShooting = new Marble();
    var randomIndex = Math.floor(Math.random() * 3 + 0);
    this.marbleForShooting.materialColor = settings.colors[randomIndex];
    this.marbleForShooting.position.set(0, 100, 900);
    this.marbleForShooting.name = "marbleForShooting";
    this.marbleForShooting.randomColor = randomIndex;
    this.scene.add(this.marbleForShooting);
  }

  stats() {
    var script = document.createElement("script");
    script.onload = function() {
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
    if (this.launched) {
      console.log(this.directionVect);
      this.marbleForShooting.translateOnAxis(this.directionVect, 80); // 5 - przewidywany speed
      this.marbleForShooting.position.y = 100;
      this.checkIfCollides(function() {
        game.launched = false;
      });
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
          //edge.position.set(0, 100, 990);
          break;
        case 1:
          //edge.position.set(0, 200, -1700);
          //edge.updateMatrix();
          //singleGeometry.merge(edge.geometry, edge.matrix);
          break;
        case 2:
          edge.position.set(-1200, 200, 0);
          edge.rotation.y = Math.PI / 2;
          edge.updateMatrix();
          singleGeometry.merge(edge.geometry, edge.matrix);
          break;
        case 3:
          edge.position.set(1200, 200, 0);
          edge.rotation.y = Math.PI / 2;
          edge.updateMatrix();
          singleGeometry.merge(edge.geometry, edge.matrix);
          break;
      }
    }
    var edges = new THREE.Mesh(singleGeometry, settings.edgeMaterial);
    edges.name = "wall";
    this.collidableElementsArray.push(edges);
    this.scene.add(edges);
  }

  shoot() {
    $(document).mousemove(function(event) {
      if (!game.launched) {
        if (game.directionArrow != null)
          //usuwanie strzałki
          game.scene.remove(
            game.scene.getObjectByName(game.directionArrow.name)
          );
        game.mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        game.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        game.raycaster.setFromCamera(game.mouseVector, game.camera);
        var intersects = game.raycaster.intersectObjects(game.scene.children);
        if (intersects.length > 0) {
          // console.log("Trafiono w ", intersects[0].object.name);
          game.clickedVect = intersects[0].point;
          // console.log("Wektor klikniętego punktu ", game.clickedVect);
          game.directionVect = game.clickedVect
            .clone()
            .sub(game.marbleForShooting.position)
            .normalize();

          var matrix = new THREE.Matrix4();
          matrix.extractRotation(game.marbleForShooting.matrix);

          var marbleDirection = new THREE.Vector3(0, 0, 1);
          marbleDirection.applyMatrix4(matrix);

          // var marbleDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
          //   game.marbleForShooting.quaternion
          // );

          var length = 1000;
          var hex = 0xffff00;
          game.directionArrow = new THREE.ArrowHelper(
            game.directionVect,
            marbleDirection,
            length,
            hex
          );
          game.directionArrow.name = "directionArrow";
          game.directionArrow.position.set(0, 100, 900);
          game.scene.add(game.directionArrow);
        }
      }
    });
    $(document).mousedown(function(event) {
      // console.log("Wektor kierunkowy ", game.directionVect);
      //funkcja normalize() przelicza współrzędne x,y,z wektora na zakres 0-1
      //jest to wymagane przez kolejne funkcje
      game.launched = true;
    });
  }

  checkIfCollides(callback) {
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

      var collisionResults = ray.intersectObjects(game.collidableElementsArray);
      if (
        collisionResults.length > 0 &&
        collisionResults[0].distance < directionVector.length()
      ) {
        // a collision occurred... do something...
        var strikedElement = collisionResults[0].object.name;
        if (strikedElement.indexOf("marble") >= 0) {
          this.strikedMarble = strikedElement;
          marbles.destroyMarbles(this.strikedMarble);
          this.reflection = false;
          this.launched = false;
          callback();
          break;
          //alert("Kolizja");
        } else if (strikedElement == "wall") {
          if (!this.reflection) {
            this.reflection = true;
            this.directionVect.x = -this.directionVect.x;
            console.log("Ściana");
          }
        }
      }
    }
  }
}
