import { House } from "./House.js";

export class Houses extends THREE.Mesh {
    constructor(buttons) {
        super()
        this.geometry = new THREE.BoxGeometry(260, 1, 260);
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0xcffffff,
            transparent: true,
            opacity: 0,
        })
        this.position.set(0, 0, 0);
        this.children = [];
        this.buttons = buttons;
        this.name = "houses";
    }
    genHouse = async (type, fieldID) => {
        let house = new House(type);
        this.children.push(house);
        let tile = await this.buttons.findByID(fieldID);
        house.position.set(tile.position.x, -15, tile.position.z);
        return house;
    }
}