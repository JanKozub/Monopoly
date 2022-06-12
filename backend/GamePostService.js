const Utils = require('./Utils.js');

class GamePostService {
    gameDBService;
    gamesManager;
    databaseService;
    fields;
    skinName = ["Hotdog", "RJ-45", "Kebab", "Rezystor", "Router", "Piwo"];

    constructor(gameDBService, gamesManager, databaseService) {
        this.gameDBService = gameDBService;
        this.gamesManager = gamesManager;
        this.databaseService = databaseService;
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

    async cubeScore(req, res) {
        let game = this.gamesManager.getGameById(req.session.gameId);
        game.playerList[req.body.player_id].position += (req.body.cube_scores[0] + req.body.cube_scores[1]);

        let user = await this.databaseService.getUserFromDataBase(game.playerList[req.body.player_id].nick); // STATS UPDATE
        await this.databaseService.updateStat(user.id, 'rolledNumSum', user.rolledNumSum + (req.body.cube_scores[0] + req.body.cube_scores[1])).then()
        await this.databaseService.updateStat(user.id, 'rollCounter', user.rollCounter + 1).then()

        if (game.prison.length < game.playerList.length / 2) {
            game.lastThrow = req.body.player_id;
        }

        if (game.playerList[req.body.player_id].position >= 40) {
            game.playerList[req.body.player_id].position -= 40;
            game.playerList[req.body.player_id].cash += 200
            game.lastAction =
                "Gracz " + game.playerList[req.body.player_id].nick +
                " (" + this.skinName[game.playerList[req.body.player_id].skin] + ") otrzymał 200$";

            let user = await this.databaseService.getUserFromDataBase(game.playerList[req.body.player_id].nick); // STATS UPDATE
            await this.databaseService.updateStat(user.id, 'moneySum', user.moneySum + 200).then()
        }
        game.actual_cubes = [req.body.cube_scores[0], req.body.cube_scores[1]]
        this.gamesManager.updateGameWithId(game);
        res.send(JSON.stringify(""))
    }

    update(req, res) {
        let game = this.gamesManager.getGameById(req.session.gameId);
        let data;
        if (game !== null) {
            this.ifLastStand(game); //sprawdza czy został jeden zwycięzca
            this.ifOnlyOneFree(game); //sprawdza czy tylko jeden jest na wolności
            data = {
                playerList: game.playerList,
                tura: game.tura,
                cubes: game.actual_cubes,
                fields: this.fields,
                lastAction: game.lastAction,
                lastCard: game.lastCard,
                lastThrow: game.lastThrow,
                onlyFree: game.lastFree,
                win: game.win
            }
        } else {
            data = {response: 'id not found'}
        }
        res.send(JSON.stringify(data))
    }

    ifLastStand = (game) => {
        if (game.dead.length === game.playerList.length - 1) {
            let tempList = [];
            game.playerList.forEach(element => {
                tempList.push(element)
            });
            game.dead.forEach(elementX => {
                tempList.forEach(elementY => {
                    if (elementY.id === elementX) {
                        let index = tempList.indexOf(elementY);
                        tempList.splice(index, 1);
                    }
                });
            });
            game.win = tempList[0].id;
        }
    }

    ifOnlyOneFree = (game) => {
        if (game.prison.length === game.playerList.length - 1) {
            let tempList = []
            game.playerList.forEach(element => {
                tempList.push(element);
            });
            tempList.forEach(element => {
                if (game.prison.includes(element.id)) {
                    let index = tempList.indexOf(element);
                    tempList.splice(index, 1);
                }
            });
            this.onlyFree = tempList[0].id;
        } else {
            this.onlyFree = -1
        }
    }

    nextTura(req, res) {
        let game = this.gamesManager.getGameById(req.session.gameId);
        if (game !== null) {
            game.lastThrow = req.body.player_id;
            game.tura = game.tura + 1;
            if (game.tura > game.playerList.length - 1) {
                game.tura = 0;
            }
            if (game.prison.includes(game.tura)) { //JEŻELI GRACZ JEST W PRISON TO SKIPUJE MU KOLEJKE
                game.time_inprison.forEach(prisoner => {
                    if (prisoner.who === game.tura) {
                        prisoner.time++; //CO KAŻDĄ KOLEJKĘ ROŚNIE MU CZAS SPĘDZOZNY W WIĘZIENIU
                        if (prisoner.time < game.punishment) {
                            game.tura++;
                            if (game.tura > game.playerList.length - 1) {
                                game.tura = 0;
                            }
                        } else { //JEŚLI POBYT W WIĘZIENIU JEST DŁUŻSZY NIŻ CZAS KARY TO GO WYPUŚĆ
                            let prison_id = game.prison.indexOf(prisoner.who);
                            let prison_time_id = game.time_inprison.indexOf(prisoner);
                            game.prison.splice(prison_id, 1);
                            game.time_inprison.splice(prison_time_id, 1);
                        }
                    }
                });
            }
            if (game.prison.length === game.playerList.length) {
                game.prison.splice(0, 1);
                game.time_inprison.forEach(prisoner => {
                    if (prisoner.who === game.prison[0]) {
                        let index = game.time_inprison.indexOf(prisoner);
                        game.time_inprison.splice(index, 1);
                    }
                });
            }
            if (game.prison.length === game.playerList.length - 1) {
                game.lastThrow = game.prison[game.prison.length - 1];
            }
            if (game.playerList[game.tura].dead) {
                game.tura++
                if (game.tura > game.playerList.length - 1) {
                    game.tura = 0;
                }
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

    async action(req, res) {
        let game = this.gamesManager.getGameById(req.session.gameId);

        switch (req.body.action) {
            case "buy": //gracz wywołał akcję BUY
                if (game.playerList[req.body.player_id].cash >= this.fields[req.body.fieldIdx].price) {
                    let user = await this.databaseService.getUserFromDataBase(game.playerList[req.body.player_id].nick); // STATS UPDATE
                    await this.databaseService.updateStat(user.id, 'placesBoughtSum', user.placesBoughtSum + 1).then()

                    game.playerList[req.body.player_id].cash -= this.fields[req.body.fieldIdx].price;
                    game.playerList[req.body.player_id].eq.push(req.body.fieldIdx);

                    this.fields[req.body.fieldIdx].action = "take"
                    this.fields[req.body.fieldIdx].value = this.fields[req.body.fieldIdx].price / 2 //OPLATA 1/2 CENY DZIALKI
                    this.fields[req.body.fieldIdx].owner = req.body.player_id;

                    game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick + " (" + this.skinName[game.playerList[req.body.player_id].skin] + ") kupił " + this.fields[req.body.fieldIdx].name;
                }
                break;
            case "take": //gracz wywołał akcję TAKE
                let restricted_names = ["brak", "Dyrektor Piszkowski", "i tak to idzie na fajki", "Dragosz"];
                game.playerList[req.body.player_id].cash -= this.fields[req.body.fieldIdx].value;
                game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick + " (" + this.skinName[game.playerList[req.body.player_id].skin] + ") stracił " + this.fields[req.body.fieldIdx].value + "$";
                if (!restricted_names.includes(this.fields[req.body.fieldIdx].owner)) {
                    game.playerList[this.fields[req.body.fieldIdx].owner].cash += this.fields[req.body.fieldIdx].value;
                }
                break;
            case "card": //gracz wywołał akcję CARD
                //losuj kartę z listy kart, zwróć treść (text), akcje (action)(take lub add) oraz wartość (value) (ile dodać/odjąć)
                let card = this.getRandomCard();
                game.lastCard = "Karta dla gracza: " +
                    game.playerList[req.body.player_id].nick +
                    " (" + this.skinName[game.playerList[req.body.player_id].skin] + ") "
                    + card.text;
                if (card.action === "take") {
                    game.playerList[req.body.player_id].cash -= card.value;
                } else if (card.action === "add") {
                    game.playerList[req.body.player_id].cash += card.value;

                    let user = await this.databaseService.getUserFromDataBase(game.playerList[req.body.player_id].nick); // STATS UPDATE
                    await this.databaseService.updateStat(user.id, 'moneySum', user.moneySum + parseInt(card.value)).then()
                }
                break;
            case "add": //gracz wywołał akcję ADD
                if (!game.playerList[req.body.player_id].dead) {
                    game.playerList[req.body.player_id].cash += req.body.value;
                    game.lastAction = "Gracz " +
                        game.playerList[req.body.player_id].nick +
                        " (" + this.skinName[game.playerList[req.body.player_id].skin]
                        + ") otrzymał " + req.body.value + "$";

                    let user = await this.databaseService.getUserFromDataBase(game.playerList[req.body.player_id].nick); // STATS UPDATE
                    await this.databaseService.updateStat(user.id, 'moneySum', user.moneySum + parseInt(req.body.value)).then()
                }
                break;
            case "build": //gracz wywołał akcję BUILD
                let price = this.fields[req.body.fieldIdx].price * (1.5 * req.body.type);
                game.playerList[req.body.player_id].cash -= price;
                this.fields[req.body.fieldIdx].shops.push(req.body.type);

                this.fields[req.body.fieldIdx].value += (this.fields[req.body.fieldIdx].price / 2) * this.fields[req.body.fieldIdx].shops.length;

                game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick +
                    " (" + this.skinName[game.playerList[req.body.player_id].skin] + ") rozbudował " +
                    this.fields[req.body.fieldIdx].name + " za " + price + "$";
                break;
            case "prison": //gracz wywołał akcję PRISON
                game.prison.push(req.body.player_id)
                game.time_inprison.push({who: req.body.player_id, time: 1})
                game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick +
                    " (" + this.skinName[game.playerList[req.body.player_id].skin] + ") " +
                    "trafił do więzienia! ";
                break;
            case "lose": //gracz stracił całe pieniądze
                game.playerList[req.body.player_id].dead = true;
                game.playerList[req.body.player_id].cash = 0;
                game.dead.push(req.body.player_id);
                game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick +
                    " (" + this.skinName[game.playerList[req.body.player_id].skin] + ") zbankurotwał! ";
                break;
        }
        if (game.tura > game.playerList.length - 1) {
            game.tura = 0;
        }
        this.gamesManager.updateGameWithId(game);
        res.send(JSON.stringify("a"))
    }

    getPlayerId(req, res) {
        let game = this.gamesManager.getGameById(req.body.gameId);

        let id = 0;

        for (let i = 0; i < game.playerList.length; i++) {
            if (game.playerList[i].nick === req.session.user.nick) {
                id = game.playerList[i].id;
            }
        }

        res.send(JSON.stringify({id: id}))
    }

    getRandomCard = () => {
        let index = this.getRandomInt(0, 19);
        return Utils.getCard(index);
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async deleteGame(req, res) {
        let game = this.gamesManager.getGameById(req.body.id);
        if (game !== null){
            for (let i = 0; i < game.players.length; i++) {
                await this.databaseService.updateStat(game.players[i].id, 'gamesPlayed', game.players[i].gamesPlayed + 1).then()
            }
            let user = await this.databaseService.getUserFromDataBase(game.playerList[game.win].nick);
            await this.databaseService.updateStat(user.id, 'gamesWon', user.gamesWon + 1).then()
        }

        this.gamesManager.deleteGameWithId(req.body.id);
        res.send('game deleted');
    }

    endGame(req, res) {
        this.gamesManager.endGameProcess(req.body.id);
        res.send('game ended')
    }
}

module.exports = GamePostService;