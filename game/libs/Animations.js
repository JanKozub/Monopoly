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
            {x: this.deg(-450), y: this.deg(720), z: this.deg(450)},
            {x: this.deg(360), y: this.deg(90), z: this.deg(360)},
            {x: this.deg(360), y: this.deg(360), z: this.deg(-90)},
            {x: this.deg(360), y: this.deg(90), z: this.deg(90)},
            {x: this.deg(450), y: this.deg(90), z: this.deg(450)},
            {x: this.deg(90), y: this.deg(360), z: this.deg(360)}
        ]

        new TWEEN.Tween(cube.position) // co
            .to({y: 10}, 1500 + offsetTime) // do jakiej pozycji, w jakim czasie
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
            .to({x: -10 + offsetX, z: -10 + offsetZ}, 1500 + offsetTime) // do jakiej pozycji, w jakim czasie
            .easing(TWEEN.Easing.Linear.None) // typ easingu (zmiana w czasie)
            .onComplete(() => {
                this.gameNet.inMove = []
            }) // funkcja po zakończeniu animacji
            .start()
    };

    jumpToPoint(id, jumps, players) {
        let pionki = players.getChildren();
        pionki.forEach(pionek => {
            if (pionek.PlayerID === id) {
                this.jumpXtimes(pionek, jumps, this.playerAppearance[id].height, id);
            }
        });
    }

    jumpXtimes(target, x, back_y, id) {
        let cnt = 0;
        jump(this.playerList, this.playerAppearance, this.game, this.gameNet);

        function jump(playerList, playerAppearance, game, gameNet) {
            let corners = [0, 10, 20, 30]
            let pos = playerList[target.PlayerID].position;
            let dir = {};

            let buttons = game.buttons.getChildren();
            buttons.forEach(element => {
                if (element.fieldID === pos) {
                    dir = {x: element.position.x, z: element.position.z};
                    dir.x += playerAppearance[target.PlayerID].offset.x;
                    dir.z += playerAppearance[target.PlayerID].offset.z;
                }
            });

            if (cnt < x) {
                if (corners.includes(pos)) {
                    new TWEEN.Tween(target.rotation)
                        .to({y: target.rotation.y - 90 * (Math.PI / 180)}, 300)
                        .repeat(0)
                        .easing(TWEEN.Easing.Linear.None)
                        .onUpdate(() => {
                        })
                        .onComplete(() => {
                        })
                        .start()
                }
                new TWEEN.Tween(target.position)
                    .to({x: dir.x, z: dir.z}, 300)
                    .repeat(0)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate(() => {
                    })
                    .onComplete(() => {
                    })
                    .start()
                new TWEEN.Tween(target.position)
                    .to({y: 30}, 150)
                    .repeat(0)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate(() => {
                    })
                    .onComplete(() => {
                        new TWEEN.Tween(target.position)
                            .to({y: back_y}, 150)
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

    deg(deg) {
        return deg * Math.PI / 180;
    };
}
