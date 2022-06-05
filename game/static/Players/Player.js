class Player extends THREE.Mesh {
    constructor(id, color, emissive, skin) {
        super()
        this.material = new THREE.MeshPhysicalMaterial({
            roughness: 0.7,
            color: color,
            transmission: 1,
            thickness: 1,
            depthWrite: true,
            depthTest: true,
            emissive: emissive,
            shininess: 1,
        });
        const loader = new THREE.STLLoader()
        loader.load(
            '../obj/' + skin + '.stl',
            (geometry) => {
                this.geometry = geometry;
            },
            (xhr) => {
                //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                //console.log(error)
            }
        )
        this.name = "player";
        this.skinName = skin;
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

