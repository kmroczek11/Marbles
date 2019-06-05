class Light {
    constructor(x, y, z, distance) {
        this.spotLight = new THREE.SpotLight(0xFFFFFF, 1.5, distance, Math.PI / 4, 0.6);
        this.spotLight.position.set(x, y, z);
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 1024;
        this.spotLight.shadow.mapSize.height = 1024;
        this.spotLight.shadow.camera.near = 0.5;
        this.spotLight.shadow.camera.far = 500
        return this.spotLight;
    }
}