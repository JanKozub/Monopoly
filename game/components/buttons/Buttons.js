import { Button } from "./Button.js";

export class Buttons extends THREE.Mesh {
    constructor() {
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
        this.name = "buttons";
        this.index_list = this.genIndexTable();
        this.genButtons();
        this.genCorners();
    }

    genButtons = () => {
        let x = 0;
        let multiplier = 0;
        while (x < 36) {
            let button = new Button(20, 34, this.index_list[x]);
            if (multiplier > 8) {
                multiplier = 0
            }
            if (x < 9 || x > 17 && x < 27) {
                button.rotation.y = 0;
                if (x < 9) {
                    button.position.set(84 - multiplier * 21, 1, 112)
                } else {
                    button.position.set(-84 + multiplier * 21, 1, -112)
                }
            } else {
                button.rotation.y = Math.PI / 2; //90deg rotation
                if (x < 18) {
                    button.position.set(-112, 1, 84 - multiplier * 21)
                } else {
                    button.position.set(112, 1, -84 + multiplier * 21)
                }
            }

            this.children.push(button);
            x++;
            multiplier++;
        }
    }

    genCorners = () => {
        let x = 0;
        let pos = [{ x: 112, y: 112 }, { x: -112, y: 112 }, { x: -112, y: -112 }, { x: 112, y: -112 }]
        while (x < 4) {
            let button = new Button(34, 34, x * 10)
            button.position.set(pos[x].x, 1, pos[x].y)
            this.children.push(button);
            x++;
        }
    }

    hide = () => {
        this.children.forEach(element => {
            element.material.opacity = 0;
        });
    }

    genIndexTable = () => {
        let index_list = [];
        for (let i = 1; i <= 39; i++) {
            if (!(i % 10 === 0)) {
                index_list.push(i)
            }
        }
        return index_list;
    }

    getChildren = () => {
        return this.children;
    }

    findByID = async (id) => {
        return new Promise(resolve => {
            this.children.forEach(element => {
                if (element.fieldID === id) {
                    resolve(element);
                }
            });
        })
    }
}