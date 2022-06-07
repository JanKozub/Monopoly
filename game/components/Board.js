export class Board extends THREE.Mesh {
    constructor() {
        super()
        this.geometry = new THREE.BoxGeometry(260, 1, 260);
        this.material = new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('../board.png')
        })
        this.name = "gameboard";
        this.position.set(0, 0, 0);
    }

    getName() {
        return this.name;
    }
}