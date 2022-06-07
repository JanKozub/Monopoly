class GamePostService {
    gameDBService;
    gamesManager;
    fields;

    constructor(gameDBService, gamesManager) {
        this.gameDBService = gameDBService;
        this.gamesManager = gamesManager;
    }

    async getFields(req, res) {
        let fields = await this.gameDBService.getFields();
        this.fields = fields;
        res.send(JSON.stringify(fields))
    }

    initGame(req, res) {
        let game = this.gamesManager.getGameById(req.body.id)
        if (game !== null) {
            res.send(JSON.stringify(game.playerList))
        } else {
            res.send(JSON.stringify({response: "game not found"}))
        }
    }

    cubeScore(req, res) {
        let game = this.gamesManager.getGameById(req.session.gameId);
        game.playerList[req.body.player_id].position += (req.body.cube_scores[0] + req.body.cube_scores[1]);

        if (game.playerList[req.body.player_id].position >= 40) {
            game.playerList[req.body.player_id].position -= 40;
            game.playerList[req.body.player_id].cash += 200
            game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick + " (" + game.playerList[req.body.player_id].skin + ") otrzymał 200$";
        }
        game.actual_cubes = [req.body.cube_scores[0], req.body.cube_scores[1]]
        this.gamesManager.updateGameWithId(game);
        res.send(JSON.stringify(""))
    }

    update(req, res) {
        let game = this.gamesManager.getGameById(req.session.gameId);
        let data;
        if (game !== null) {
            data = {
                playerList: game.playerList,
                tura: game.tura,
                cubes: game.actual_cubes,
                fields: this.fields,
                lastAction: game.lastAction
            }
        } else {
            data = {response: 'id not found'}
        }
        res.send(JSON.stringify(data))
    }

    nextTura(req, res) {
        let game = this.gamesManager.getGameById(req.session.gameId);

        if (game !== null) {
            game.tura = game.tura + 1;
            if (game.tura > game.playerList.length - 1) {
                game.tura = 0;
            }
            this.gamesManager.updateGameWithId(game);
        }
        res.send(JSON.stringify("a"))
    }

    setCubes(req, res) {
        let game = this.gamesManager.getGameById(req.session.gameId);
        game.actual_cubes = [req.body.cubea, req.body.cubeb];
        this.gamesManager.updateGameWithId(game);
        res.send(JSON.stringify("a"))
    }

    setPosition(req, res) {
        let game = this.gamesManager.getGameById(req.session.gameId);
        game.playerList[req.body.id].position = req.body.pos;
        this.gamesManager.updateGameWithId(game);
        res.send(JSON.stringify("a"))
    }

    action(req, res) {
        let game = this.gamesManager.getGameById(req.session.gameId);

        switch (req.body.action) {
            case "buy": //gracz wywołał akcję BUY
                if (game.playerList[req.body.player_id].cash >= this.fields[req.body.fieldIdx].price) {

                    game.playerList[req.body.player_id].cash -= this.fields[req.body.fieldIdx].price;
                    game.playerList[req.body.player_id].eq.push(req.body.fieldIdx);

                    this.fields[req.body.fieldIdx].action = "take"
                    this.fields[req.body.fieldIdx].value = 100 //WSTAWIC OPLATE NA PODSTAWIE LICZBY DOMKÓW I ID POLA
                    this.fields[req.body.fieldIdx].owner = req.body.player_id;
                    this.fields[req.body.fieldIdx].price = 0; //POLE STAJE SIE NIEKUPOWALNE

                    game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick + " (" + game.playerList[req.body.player_id].skin + ") kupił " + this.fields[req.body.fieldIdx].name;
                }
                break;
            case "take": //gracz wywołał akcję TAKE
                game.playerList[req.body.player_id].cash -= fields[req.body.fieldIdx].value;
                game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick + " (" + game.playerList[req.body.player_id].skin + ") stracił " + this.fields[req.body.fieldIdx].value + "$";
                break;
            case "card": //gracz wywołał akcję CARD
                //losuj kartę z listy kart, zwróć treść (text), akcje (action)(take lub add) oraz wartość (value) (ile dodać/odjąć)
                break;
            case "add": //gracz wywołał akcję ADD
                game.playerList[req.body.player_id].cash += req.body.value;
                game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick + " (" + game.playerList[req.body.player_id].skin + ") otrzymał " + req.body.value + "$";
                break;


            // case "build": //gracz wywołał akcję BUILD
            //     playerList[req.body.player_id].cash -= fields[req.body.fieldIdx].price;
            //     break;
        }
        if (game.tura > game.playerList.length - 1) {
            game.tura = 0;
        }
        this.gamesManager.updateGameWithId(game);
        res.send(JSON.stringify("a"))
    }
}

module.exports = GamePostService;