export class CubeDot extends THREE.Mesh {
    constructor(x, y, z, size) {
        super()
        this.geometry = new THREE.CylinderGeometry(size / 12, size / 12, size / 12)
        this.material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            depthWrite: true,
            depthTest: true,
            emissive: 0x000000,
            shininess: 20,
            specular: 0x000000,
        })
        this.name = "dot";
        this.position.set(x, y, z)
    }
}