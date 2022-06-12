import { Player } from "./Player.js";

export class Players extends THREE.Mesh {

    constructor(playerList, playerAppearance) {
        super()
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0xcffffff,
            transparent: true,
            opacity: 0,
        })
        this.position.set(0, 10, 0);
        this.children = [];
        this.name = "players";
        this.genPlayers(playerList, playerAppearance);
    }

    genPlayers(playerList, playerAppearance) {
        playerList.forEach(player => {
            if (player.position !== -1) {
                let pionek = new Player(player.id, playerAppearance[player.skin].color, playerAppearance[player.skin].emissive, player.skin);
                pionek.set_position(112 + playerAppearance[player.skin].offset.x, playerAppearance[player.skin].height, 112 + playerAppearance[player.skin].offset.z);
                pionek.set_scale(playerAppearance[player.skin].scale)
                pionek.set_rotation(
                    this.deg2rad(-playerAppearance[player.skin].rotation.x),
                    this.deg2rad(-playerAppearance[player.skin].rotation.y),
                    this.deg2rad(-playerAppearance[player.skin].rotation.z))
                this.children.push(pionek);
            }

        });
    }

    deg2rad(x) {
        return x * (Math.PI / 180);
    }

    getChildren() {
        return this.children;
    }
}