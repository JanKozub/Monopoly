export class House extends THREE.Mesh {
    constructor(type) {
        super()
        this.geometry = new THREE.BoxGeometry(5, type * 7, 5);
        this.material = new THREE.MeshPhongMaterial({
            color: 0xc027e1b,
            emissive: 0xc162509,
            specular: 0xc162509,
            shinines: 20,
        })
        // if (type == 1) {
        //     this.material.color = 0xc027e1b;
        //     this.material.specular = 0xc162509;
        // } else {
        //     this.material.color = 0xc610000;
        //     this.material.specular = 0xc250909;
        // }
        this.name = "house";
    }
}