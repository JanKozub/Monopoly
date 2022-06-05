export class RayCaster {
    static rayCaster = new THREE.Raycaster();
    static mouseVector = new THREE.Vector2();

    static cameraCaster(event, target, camera, flags) {
        this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.rayCaster.setFromCamera(this.mouseVector, camera);

        if (this.checkRayCaster(flags)) {
            return this.rayCaster.intersectObjects(target);
        } else {
            return [];
        }
    }

    static checkRayCaster(flags) {
        return !flags.hamburgerFlag && !flags.buttons_flag;
    }
}