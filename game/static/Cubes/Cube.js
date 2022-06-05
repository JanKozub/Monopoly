class Cube extends THREE.Mesh {
    constructor(size, id) {
        super()
        this.geometry = RoundEdgedBox(size, size, size, 3, 3, 3, 3, 3);
        this.material = new THREE.MeshPhysicalMaterial({
            roughness: 0.7,
            transmission: 1,
            thickness: 1,
            depthWrite: true,
            depthTest: true,
            emissive: 0x202020,
            shininess: 10,
        });
        this.name = "cube";
        this.CubeID = id;
        this.genDots(size);
        this.castShadow = true;
    }
    genDots(size) {
        let s = size / 4 * 0.8;
        // *
        let dot1 = new CubeDot(0, 0, size / 2, size);
        dot1.rotation.x = 90 * Math.PI / 180
        this.add(dot1);

        // ** 
        let dots2 = [1, -1]
        dots2.forEach(x => {
            let dot = new CubeDot(s * x, size / 2, -s * x, size);
            dot.rotation.y = 90 * Math.PI / 180
            this.add(dot);
        });

        // *** 
        for (let x in [1, 2, 3]) {
            let dot = new CubeDot(-size / 2, -s + x * s, -s + x * s, size);
            dot.rotation.z = 90 * Math.PI / 180
            this.add(dot);
        }

        // ****
        let dots4 = [-1, 1]
        dots4.forEach(x => {
            let dot1 = new CubeDot(size / 2, -s, s * x, size);
            dot1.rotation.z = 90 * Math.PI / 180
            let dot2 = new CubeDot(size / 2, s, s * x, size);
            dot2.rotation.z = 90 * Math.PI / 180
            this.add(dot1);
            this.add(dot2);
        });

        // *****
        let dots5 = [1, -1]
        dots5.forEach(x => {
            let dot1 = new CubeDot(-s, -size / 2, s * x, size);
            dot1.rotation.y = 90 * Math.PI / 180
            let dot2 = new CubeDot(s, -size / 2, s * x, size);
            dot2.rotation.y = 90 * Math.PI / 180
            this.add(dot1);
            this.add(dot2);
        });
        let dot51 = new CubeDot(0, -size / 2, 0, size);
        dot51.rotation.y = 90 * Math.PI / 180
        this.add(dot51);

        //******
        let dots6 = [-1, 1]
        dots6.forEach(x => {
            let dot1 = new CubeDot(-s * 1.2, s * x, -size / 2, size);
            dot1.rotation.x = 90 * Math.PI / 180
            let dot2 = new CubeDot(0, s * x, -size / 2, size);
            dot2.rotation.x = 90 * Math.PI / 180
            let dot3 = new CubeDot(s * 1.2, s * x, -size / 2, size);
            dot3.rotation.x = 90 * Math.PI / 180
            this.add(dot1);
            this.add(dot2);
            this.add(dot3);
        });

    }
}