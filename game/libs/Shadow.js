export class ShadowPlane {
    constructor() {
        this.container = new THREE.Object3D();
        this.init()
    }

    init() {
        this.shgeometry = new THREE.PlaneGeometry(2000, 2000);
        this.shgeometry.rotateX(-Math.PI / 2);

        this.shmaterial = new THREE.ShadowMaterial();
        this.shmaterial.opacity = 0.2;

        this.plane = new THREE.Mesh(this.shgeometry, this.shmaterial);
        this.plane.position.y = 2;
        this.plane.receiveShadow = true;

        this.container.add(this.plane);
    }

    getPlane() {
        return this.container;
    }
}

export class Light {

    constructor() {
        this.container = new THREE.Object3D();
        this.init()
    }

    init() {
        this.light = new THREE.DirectionalLight(0xddeeff, 1);//HemisphereLight(0x4445ff, 0x40ff70, 1);
        this.light.intensity = 1;
        this.light.position.set(0, 220, 0);

        this.light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(60, 1, 10, 2500));
        this.light.shadow.bias = 0.0001;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 1024;
        this.light.castShadow = true;
        this.light.shadow.camera.near = 0.5;
        this.light.shadow.camera.far = 300
        this.helper = new THREE.CameraHelper(this.light.shadow.camera)

        this.container.add(this.light);
    }

    getLight() {
        return this.container;
    }
}