const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();

cameraCaster = (event, target, camera) => {
    mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouseVector, camera);

    if (checkRaycaster()) {
        return raycaster.intersectObjects(target);
    } else {
        return [];
    }
}

checkRaycaster = () => {
    return !hamburgerFlag && !buttons_flag;
}