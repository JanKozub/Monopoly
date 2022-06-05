import {Cube} from "./Cube.js";

export class Cubes extends THREE.Mesh {
    constructor(size) {
        super()
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0xcffffff,
            transparent: true,
            opacity: 0,
        })
        this.position.set(0, 10, 0);
        this.children = [];
        this.name = "cubes";
        this.size = size;
        this.genButtons();
    }

    genButtons() {
        let CubeA = new Cube(this.size, 0);
        let CubeB = new Cube(this.size, 1);
        CubeA.position.set(0, 10, 50);
        CubeB.position.set(50, 10, 0);
        this.children.push(CubeA);
        this.children.push(CubeB);
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    getChildren() {
        return this.children;
    }
}