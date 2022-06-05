class Button extends THREE.Mesh {
    constructor(x, y, id) {
        super()
        this.geometry = new THREE.BoxGeometry(x, 3, y);
        this.material = new THREE.MeshBasicMaterial({
            transparent: true,
            color: 0xcffffff,
            opacity: 0,
            depthWrite: false,
        })
        this.fieldID = id;
        this.name = "button";
    }
}