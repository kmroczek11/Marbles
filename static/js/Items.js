class Items {
    constructor() {
        this.items = []
        var that = this
        setInterval(function () { that.randomItem() }, 1000)
    }


    randomItem() {
        if (!game.canPlay || game.over || !game)
            return

        var random = Math.floor(Math.random() * settings.items.length)
        var model = settings.items[random];
        var x = this.rand(settings.startingX, 1100)
        var y = 70
        var z = this.rand(settings.startingZ, settings.finishZ - 200);
        if (!this.canPlace(x, y, z))
            return
        var item = this.createItem(model, x, y, z, settings.itemsScale[random])
        this.items.push(item)
        game.scene.add(item);
    }

    canPlace(x, y, z) {
        var pos = new THREE.Vector3(x, y, z);
        var marbleWidth = game.marbleForShooting.geometry.parameters.radius;
        var result = true
        marbles.each(function (marble) {
            if (marble.position.distanceTo(pos) < marbleWidth * 2) {
                result = false
                return
            }
        });
        this.each(function (item) {
            if (item.position.distanceTo(pos) < marbleWidth * 2) {
                result = false
                return
            }
        });
        console.log(result)
        return result
    }

    each(callback) {
        for (var i = 0; i < this.items.length; i++)
            callback(this.items[i], i)
    }

    animate() {
        this.each(function (item) {
            item.rotation.z += 0.1
        })
    }

    handleCollision(item, i) {
        if (item.name.includes("rocket"))
            game.speed += 15
        if (item.name.includes("ice"))
            game.speed -= 15
        this.restrictGameSpeed()
        game.scene.remove(item)
        this.items.splice(i, 1);
    }

    restrictGameSpeed() {
        if (game.speed < 15)
            game.speed = 15
        if (game.speed > 150)
            game.speed = 150
    }

    createItem(model, x, y, z, scale) {
        var item = new THREE.Mesh()
        item.position.x = x;
        item.position.y = y;
        item.position.z = z;
        var loader = new THREE.STLLoader();
        loader.load(
            model,
            function (geometry) {
                item.geometry = geometry;
                item.material = new THREE.MeshNormalMaterial();
            }.bind(item)
        );
        item.name = model;
        item.rotation.x = Math.PI / 2;
        item.scale.set(scale, scale, scale);
        return item;
    }

    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}