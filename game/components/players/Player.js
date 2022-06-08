export class Player extends THREE.Mesh {
    constructor(id, color, emissive, skin) {
        super()
        this.material = new THREE.MeshPhysicalMaterial({
            roughness: 0.7,
            color: color,
            depthWrite: true,
            depthTest: true,
            emissive: emissive,
        });
        const loader = new THREE.STLLoader()
        loader.load(
            '../models/pawn-' + skin + '.stl',
            (geometry) => {
                this.geometry = geometry;
            }
        )
        this.name = "player";
        this.PlayerID = id;
        this.castShadow = true;
    }
    set_position(x, y, z) {
        this.position.set(x, y, z);
    }
    set_scale(val) {
        this.scale.set(val, val, val)
    }
    set_rotation(x, y, z) {
        this.rotation.set(x, y, z)
    }
}

