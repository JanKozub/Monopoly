export class House extends THREE.Mesh {
    constructor(type) {
        super()
        this.geometry = new THREE.BoxGeometry(5, type * 8, 5);

        if (type == 1) {
            this.material = new THREE.MeshPhongMaterial({
                color: 0xc027e1b,
                emissive: 0xc162509,
                specular: 0xc162509,
            })
        } else {
            this.material = new THREE.MeshPhongMaterial({
                color: 0xc610000,
                emissive: 0xc250909,
                specular: 0xc250909,
            })
        }
        this.name = "house";
    }
}