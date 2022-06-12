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
            temp2.push({
                id: k,
                position: 1,
                skin: players[k].user.avatar,
                nick: players[k].user.nick,
                eq: [],
                dead: false,
                cash: 1500
            });
        }

        this.games.push({
            id: id,
            players: temp,
            playerList: temp2,
            lastAction: "",
            lastCard: "",
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
        return null;
    }

    updateGameWithId(game) {
        for (let i = 0; i < this.games.length; i++) {
            if (this.games[i].id === game.id) {
                return this.games[i] = game;
            }
        }
    }

    isPlayerInGame(gameId, playerId) {
        let game = this.getGameById(gameId)
        for (let i = 0; i < game.players.length; i++) {
            if (game.players[i].id === playerId) {
                return true;
            }
        }
        return false;
    }
}

module.exports = GamesManager;