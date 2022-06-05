animToIndex = async (cube, val, offsetX, offsetZ, offsetTime) => {
    cube.position.set(40 + offsetX, 200, 40 + offsetZ)
    cube.rotation.set(0, 0, 0)
    let inToRot = [
        { x: deg(-450), y: deg(720), z: deg(450) },
        { x: deg(360), y: deg(90), z: deg(360) },
        { x: deg(360), y: deg(360), z: deg(-90) },
        { x: deg(360), y: deg(90), z: deg(90) },
        { x: deg(450), y: deg(90), z: deg(450) },
        { x: deg(90), y: deg(360), z: deg(360) }
    ]
    new TWEEN.Tween(cube.position) // co
        .to({ y: 10 }, 1500 + offsetTime) // do jakiej pozycji, w jakim czasie
        .easing(TWEEN.Easing.Bounce.Out) // typ easingu (zmiana w czasie)
        .start()
    new TWEEN.Tween(cube.rotation) // co
        .to({ x: inToRot[val].x, y: inToRot[val].y, z: inToRot[val].z }, 1500 + offsetTime) // do jakiej pozycji, w jakim czasie
        .easing(TWEEN.Easing.Bounce.Out) // typ easingu (zmiana w czasie)i
        .start()
    new TWEEN.Tween(cube.position) // co
        .to({ x: -10 + offsetX, z: -10 + offsetZ }, 1500 + offsetTime) // do jakiej pozycji, w jakim czasie
        .easing(TWEEN.Easing.Linear.None) // typ easingu (zmiana w czasie)
        .onComplete(() => { cubes_in_move = false }) // funkcja po zakończeniu animacji
        .start()
};

jumpToPoint = (id, jumps) => {
    let pionki = players.getChildren();
    pionki.forEach(pionek => {
        if (pionek.PlayerID == id) {
            jumpXtimes(pionek, jumps, playerAppearance[id].height, id);
        }
    });
    console.log("suma", jumps)
}
jumpXtimes = (target, x, back_y, id) => {
    let cnt = 0;
    jump();

    function jump() {
        let corners = [0, 10, 20, 30]
        let pos = playerlist[target.PlayerID].position;
        let dir = {};

        let buttons = game.buttons.getChildren();
        buttons.forEach(element => {
            if (element.fieldID == pos) {
                dir = { x: element.position.x, z: element.position.z };
                dir.x += playerAppearance[target.PlayerID].offset.x;
                dir.z += playerAppearance[target.PlayerID].offset.z;
            }
        });

        if (cnt < x) {
            if (corners.includes(pos)) {
                new TWEEN.Tween(target.rotation)
                    .to({ y: target.rotation.y - 90 * (Math.PI / 180) }, 300)
                    .repeat(0)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate(() => { })
                    .onComplete(() => { })
                    .start()
            }
            new TWEEN.Tween(target.position)
                .to({ x: dir.x, z: dir.z }, 300)
                .repeat(0)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(() => { })
                .onComplete(() => { })
                .start()
            new TWEEN.Tween(target.position)
                .to({ y: 30 }, 150)
                .repeat(0)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(() => { })
                .onComplete(() => {
                    new TWEEN.Tween(target.position)
                        .to({ y: back_y }, 150)
                        .repeat(0)
                        .easing(TWEEN.Easing.Linear.None)
                        .onUpdate(() => { })
                        .onComplete(() => {
                            cnt++;
                            playerlist[target.PlayerID].position += 1;
                            if (playerlist[target.PlayerID].position > 39) { playerlist[target.PlayerID].position -= 40 }
                            jump();
                        })
                        .start()
                })
                .start()
        } else {
            let index = in_move.indexOf(id);
            in_move.splice(index, 1);
        }
    }
}

//ANIMATION OF GROWING HOUSES


deg = (deg) => {
    return deg * Math.PI / 180;
};
let cube_values = []
revealValues = (val) => {
    cube_values.push(val);
    if (cube_values.length == 2) {
        if (id != null) {
            //
        }

        cube_values = []
    }
}

