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
    genHouse = async (type, fieldID, nbCount) => {
        let house = new House(type);
        this.children.push(house);
        let tile = await this.buttons.findByID(fieldID);
        let quater = Math.floor(fieldID / 10);
        let offset;
        switch (quater) {
            case 0:
                offset = { x: 6 - nbCount * 6, z: -12 }
                break;
            case 1:
                offset = { x: 12, z: -6 + nbCount * 6 }
                break;
            case 2:
                offset = { x: -6 + nbCount * 6, z: 12 }
                break;
            case 3:
                offset = { x: -12, z: 6 - nbCount * 6 }
                break;
        }
        house.position.set(tile.position.x + offset.x, -20, tile.position.z + offset.z);
        return house;
    }
}