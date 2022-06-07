class GamesManager {
    games = [];

    constructor() {
    }

    addNewGame(id, players) {
        let temp = []
        let temp2 = []

        for (let i = 0; i < players.length; i++) {
            temp.push(players[i].user);
        }

        for (let k = 0; k < players.length; k++) {
            let avatar = ""
            if (players[k].user.avatar === 0) {
                avatar = "hotdog"
            } else if (players[k].user.avatar === 0) {
                avatar = "rj45"
            } else if (players[k].user.avatar === 0) {
                avatar = "kebab"
            } else if (players[k].user.avatar === 0) {
                avatar = "rezystor"
            }

            temp2.push({id: k, position: 1, skin: avatar, nick: players[k].user.nick, eq: [], cash: 1500});
        }

        this.games.push({
            id: id,
            players: temp,
            playerList: temp2,
            lastAction: "",
            actual_cubes: [2, 2],
            tura: 0
        })
    }

    getGameById(id) {
        for (let i = 0; i < this.games.length; i++) {
            if (this.games[i].id === id) {
                return this.games[i];
            }
        }
    }

    updateGameWithId(game) {
        for (let i = 0; i < this.games.length; i++) {
            if (this.games[i].id === game.id) {
                return this.games[i] = game;
            }
        }
    }
}

module.exports = GamesManager;