import {CubeDot} from "./CubeDot.js";

export class Cube extends THREE.Mesh {
    constructor(size) {
        super()
        this.geometry = this.RoundEdgedBox(size, size, size, 3, 3, 3, 3, 3);
        this.material = new THREE.MeshPhysicalMaterial({
            roughness: 0.7,
            depthWrite: true,
            depthTest: true,
            emissive: 0x202020,
        });
        this.name = "cube";
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

    RoundEdgedBox(width, height, depth, radius, widthSegments, heightSegments, depthSegments, smoothness) {
        width = width || 1;
        height = height || 1;
        depth = depth || 1;
        radius = radius || (Math.min(Math.min(width, height), depth) * .25);
        widthSegments = Math.floor(widthSegments) || 1;
        heightSegments = Math.floor(heightSegments) || 1;
        depthSegments = Math.floor(depthSegments) || 1;
        smoothness = Math.max(3, Math.floor(smoothness) || 3);

        let halfWidth = width * .5 - radius;
        let halfHeight = height * .5 - radius;
        let halfDepth = depth * .5 - radius;

        let geometry = new THREE.Geometry();

        // corners - 4 eighths of a sphere
        let corner1 = new THREE.SphereGeometry(radius, smoothness, smoothness, 0, Math.PI * .5, 0, Math.PI * .5);
        corner1.translate(-halfWidth, halfHeight, halfDepth);
        let corner2 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * .5, Math.PI * .5, 0, Math.PI * .5);
        corner2.translate(halfWidth, halfHeight, halfDepth);
        let corner3 = new THREE.SphereGeometry(radius, smoothness, smoothness, 0, Math.PI * .5, Math.PI * .5, Math.PI * .5);
        corner3.translate(-halfWidth, -halfHeight, halfDepth);
        let corner4 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * .5, Math.PI * .5, Math.PI * .5, Math.PI * .5);
        corner4.translate(halfWidth, -halfHeight, halfDepth);

        geometry.merge(corner1);
        geometry.merge(corner2);
        geometry.merge(corner3);
        geometry.merge(corner4);

        // edges - 2 fourths for each dimension
        // width
        let edge = new THREE.CylinderGeometry(radius, radius, width - radius * 2, smoothness, widthSegments, true, 0, Math.PI * .5);
        edge.rotateZ(Math.PI * .5);
        edge.translate(0, halfHeight, halfDepth);
        let edge2 = new THREE.CylinderGeometry(radius, radius, width - radius * 2, smoothness, widthSegments, true, Math.PI * 1.5, Math.PI * .5);
        edge2.rotateZ(Math.PI * .5);
        edge2.translate(0, -halfHeight, halfDepth);

        // height
        let edge3 = new THREE.CylinderGeometry(radius, radius, height - radius * 2, smoothness, heightSegments, true, 0, Math.PI * .5);
        edge3.translate(halfWidth, 0, halfDepth);
        let edge4 = new THREE.CylinderGeometry(radius, radius, height - radius * 2, smoothness, heightSegments, true, Math.PI * 1.5, Math.PI * .5);
        edge4.translate(-halfWidth, 0, halfDepth);

        // depth
        let edge5 = new THREE.CylinderGeometry(radius, radius, depth - radius * 2, smoothness, depthSegments, true, 0, Math.PI * .5);
        edge5.rotateX(-Math.PI * .5);
        edge5.translate(halfWidth, halfHeight, 0);
        let edge6 = new THREE.CylinderGeometry(radius, radius, depth - radius * 2, smoothness, depthSegments, true, Math.PI * .5, Math.PI * .5);
        edge6.rotateX(-Math.PI * .5);
        edge6.translate(halfWidth, -halfHeight, 0);

        edge.merge(edge2);
        edge.merge(edge3);
        edge.merge(edge4);
        edge.merge(edge5);
        edge.merge(edge6);

        // sides
        // front
        let side = new THREE.PlaneGeometry(width - radius * 2, height - radius * 2, widthSegments, heightSegments);
        side.translate(0, 0, depth * .5);

        // right
        let side2 = new THREE.PlaneGeometry(depth - radius * 2, height - radius * 2, depthSegments, heightSegments);
        side2.rotateY(Math.PI * .5);
        side2.translate(width * .5, 0, 0);

        side.merge(side2);

        geometry.merge(edge);
        geometry.merge(side);

        // duplicate and flip
        let secondHalf = geometry.clone();
        secondHalf.rotateY(Math.PI);
        geometry.merge(secondHalf);

        // top
        let top = new THREE.PlaneGeometry(width - radius * 2, depth - radius * 2, widthSegments, depthSegments);
        top.rotateX(-Math.PI * .5);
        top.translate(0, height * .5, 0);

        // bottom
        let bottom = new THREE.PlaneGeometry(width - radius * 2, depth - radius * 2, widthSegments, depthSegments);
        bottom.rotateX(Math.PI * .5);
        bottom.translate(0, -height * .5, 0);

        geometry.merge(top);
        geometry.merge(bottom);

        geometry.mergeVertices();

        return geometry;
    }
}