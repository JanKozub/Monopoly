export class Animations {
    playerList;
    playerAppearance;
    gameNet;
    game;

    constructor(playerList, playerAppearance, game) {
        this.playerList = playerList;
        this.playerAppearance = playerAppearance;
        this.game = game;
    }

    setGameNet(gameNet) {
        this.gameNet = gameNet;
    }

    async animToIndex(cube, val, offsetX, offsetZ, offsetTime) {
        cube.position.set(40 + offsetX, 200, 40 + offsetZ)
        cube.rotation.set(0, 0, 0)
        let inToRot = [
            { x: this.deg(-450), y: this.deg(720), z: this.deg(450) },
            { x: this.deg(360), y: this.deg(90), z: this.deg(360) },
            { x: this.deg(360), y: this.deg(360), z: this.deg(-90) },
            { x: this.deg(360), y: this.deg(90), z: this.deg(90) },
            { x: this.deg(450), y: this.deg(90), z: this.deg(450) },
            { x: this.deg(90), y: this.deg(360), z: this.deg(360) }
        ]

        new TWEEN.Tween(cube.position) // co
            .to({ y: 10 }, 1500 + offsetTime) // do jakiej pozycji, w jakim czasie
            .easing(TWEEN.Easing.Bounce.Out) // typ easingu (zmiana w czasie)
            .start()

        new TWEEN.Tween(cube.rotation) // co
            .to({
                x: inToRot[val].x,
                y: inToRot[val].y,
                z: inToRot[val].z
            }, 1500 + offsetTime) // do jakiej pozycji, w jakim czasie
            .easing(TWEEN.Easing.Bounce.Out) // typ easingu (zmiana w czasie)i
            .start()
        new TWEEN.Tween(cube.position) // co
            .to({ x: -10 + offsetX, z: -10 + offsetZ }, 1500 + offsetTime) // do jakiej pozycji, w jakim czasie
            .easing(TWEEN.Easing.Linear.None) // typ easingu (zmiana w czasie)
            .onComplete(() => {
                this.gameNet.cubesInMove = false;
            }) // funkcja po zakończeniu animacji
            .start()
    };

    jumpToPoint(id, jumps, players) {
        let pionki = players.getChildren();
        pionki.forEach(pionek => {
            if (pionek.PlayerID === id) {
                let skin_height = this.playerList[id].skin;
                this.jumpXtimes(pionek, jumps, this.playerAppearance[skin_height].height, id);
            }
        });
    }

    jumpXtimes(target, x, back_y, id) {
        let cnt = 0;
        let skin = this.playerList[target.PlayerID].skin;
        jump(this.playerList, this.playerAppearance, this.game, this.gameNet);

        function jump(playerList, playerAppearance, game, gameNet) {
            let corners = [0, 10, 20, 30]
            let pos = playerList[target.PlayerID].position;
            let dir = {};

            let buttons = game.buttons.getChildren();
            buttons.forEach(element => {
                if (element.fieldID === pos) {
                    dir = { x: element.position.x, z: element.position.z };
                    dir.x += playerAppearance[skin].offset.x;
                    dir.z += playerAppearance[skin].offset.z;
                }
            });

            if (cnt < x) {
                if (corners.includes(pos)) {
                    let turn = new TWEEN.Tween(target.rotation)
                    let axis = playerAppearance[skin].turn.axis;
                    let sign = playerAppearance[skin].turn.sign;
                    if (axis === "x") {
                        turn.to({ x: target.rotation.x + sign * 90 * (Math.PI / 180) }, 300)
                    } else if (axis === "y") {
                        turn.to({ y: target.rotation.y + sign * 90 * (Math.PI / 180) }, 300)
                    } else if (axis === "z") {
                        turn.to({ z: target.rotation.z + sign * 90 * (Math.PI / 180) }, 300)
                    }
                    turn.repeat(0)
                    turn.easing(TWEEN.Easing.Linear.None)
                    turn.start()
                }
                new TWEEN.Tween(target.position)
                    .to({ x: dir.x, z: dir.z }, 300)
                    .repeat(0)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate(() => {
                    })
                    .onComplete(() => {
                    })
                    .start()
                new TWEEN.Tween(target.position)
                    .to({ y: 30 }, 150)
                    .repeat(0)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate(() => {
                    })
                    .onComplete(() => {
                        new TWEEN.Tween(target.position)
                            .to({ y: back_y }, 150)
                            .repeat(0)
                            .easing(TWEEN.Easing.Linear.None)
                            .onUpdate(() => {
                            })
                            .onComplete(() => {
                                cnt++;
                                playerList[target.PlayerID].position += 1;
                                if (playerList[target.PlayerID].position > 39) {
                                    playerList[target.PlayerID].position -= 40
                                }
                                jump(playerList, playerAppearance, game, gameNet);
                            })
                            .start()
                    })
                    .start()
            } else {
                let index = gameNet.inMove.indexOf(id);
                gameNet.inMove.splice(index, 1);
            }
        }
    }

    raiseFromBottom = (target, y) => {
        new TWEEN.Tween(target.position) // co
            .to({ y: y }, 1200) // do jakiej pozycji, w jakim czasie
            .easing(TWEEN.Easing.Bounce.Out) // typ easingu (zmiana w czasie)
            .start()
    }

    deg(deg) {
        return deg * Math.PI / 180;
    };
}
