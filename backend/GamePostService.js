const Utils = require('./Utils.js');

class GamePostService {
    gameDBService;
    gamesManager;
    fields;
    lastThrow;
    prison = [];
    time_inprison = [];
    dead = [];
    punishment = 2;
    onlyFree = -1;
    win = -1;
    skinName = ["Hotdog", "RJ-45", "Kebab", "Rezystor", "Router", "Piwo"];

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
            res.send(JSON.stringify({ response: "game not found" }))
        }
    }

    cubeScore(req, res) {
        let game = this.gamesManager.getGameById(req.session.gameId);
        game.playerList[req.body.player_id].position += (req.body.cube_scores[0] + req.body.cube_scores[1]);

        if (this.prison.length < game.playerList.length / 2) {
            this.lastThrow = req.body.player_id;
        }

        if (game.playerList[req.body.player_id].position >= 40) {
            game.playerList[req.body.player_id].position -= 40;
            game.playerList[req.body.player_id].cash += 200
            game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick + " (" + this.skinName[game.playerList[req.body.player_id].skin] + ") otrzymał 200$";
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
                lastThrow: this.lastThrow,
                onlyFree: this.lastFree,
                win: this.win
            }
        } else {
            data = { response: 'id not found' }
        }
        res.send(JSON.stringify(data))
    }
    ifLastStand = (game) => {
        if (this.dead.length == game.playerList.length - 1) {
            let tempList = [];
            game.playerList.forEach(element => {
                tempList.push(element)
            });
            this.dead.forEach(elementX => {
                tempList.forEach(elementY => {
                    if (elementY.id == elementX) {
                        let index = tempList.indexOf(elementY);
                        tempList.splice(index, 1);
                    }
                });
            });
            this.win = tempList[0].id;
        }
    }
    ifOnlyOneFree = (game) => {
        if (this.prison.length == game.playerList.length - 1) {
            let tempList = []
            game.playerList.forEach(element => {
                tempList.push(element);
            });
            tempList.forEach(element => {
                if (this.prison.includes(element.id)) {
                    let index = tempList.indexOf(element);
                    tempList.splice(index, 1);
                }
            });
            this.onlyFree = tempList[0].id;
        } else { this.onlyFree = -1 };
    }
    nextTura(req, res) {
        let game = this.gamesManager.getGameById(req.session.gameId);
        this.lastThrow = req.body.player_id;
        if (game !== null) {
            game.tura = game.tura + 1;
            if (game.tura > game.playerList.length - 1) {
                game.tura = 0;
            }
            if (this.prison.includes(game.tura)) { //JEŻELI GRACZ JEST W PRISON TO SKIPUJE MU KOLEJKE
                this.time_inprison.forEach(prisoner => {
                    if (prisoner.who === game.tura) {
                        prisoner.time++; //CO KAŻDĄ KOLEJKĘ ROŚNIE MU CZAS SPĘDZOZNY W WIĘZIENIU
                        if (prisoner.time < this.punishment) {
                            game.tura++;
                            if (game.tura > game.playerList.length - 1) {
                                game.tura = 0;
                            }
                        }
                        else { //JEŚLI POBYT W WIĘZIENIU JEST DŁUŻSZY NIŻ CZAS KARY TO GO WYPUŚĆ
                            let prison_id = this.prison.indexOf(prisoner.who);
                            let prison_time_id = this.time_inprison.indexOf(prisoner);
                            this.prison.splice(prison_id, 1);
                            this.time_inprison.splice(prison_time_id, 1);
                        }
                    }
                });
            }
            if (this.prison.length == game.playerList.length) {
                this.prison.splice(0, 1);
                this.time_inprison.forEach(prisoner => {
                    if (prisoner.who == this.prison[0]) {
                        let index = this.time_inprison.indexOf(prisoner);
                        this.time_inprison.splice(index, 1);
                    }
                });
            }
            if (this.prison.length == game.playerList.length - 1) {
                this.lastThrow = this.prison[this.prison.length - 1];
            }
            if (game.playerList[game.tura].dead) {
                game.tura++
                if (game.tura > game.playerList.length - 1) {
                    game.tura = 0;
                }
            };

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
                game.lastCard = "Karta dla gracza: " + game.playerList[req.body.player_id].nick + " (" + this.skinName[game.playerList[req.body.player_id].skin] + ") " + card.text;
                if (card.action === "take") {
                    game.playerList[req.body.player_id].cash -= card.value;
                } else if (card.action === "add") {
                    game.playerList[req.body.player_id].cash += card.value;
                }
                break;
            case "add": //gracz wywołał akcję ADD
                if (!game.playerList[req.body.player_id].dead) {
                    game.playerList[req.body.player_id].cash += req.body.value;
                    game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick + " (" + this.skinName[game.playerList[req.body.player_id].skin] + ") otrzymał " + req.body.value + "$";
                }
                break;
            case "build": //gracz wywołał akcję BUILD
                let price = this.fields[req.body.fieldIdx].price * (1.5 * req.body.type);
                game.playerList[req.body.player_id].cash -= price;
                this.fields[req.body.fieldIdx].shops.push(req.body.type);

                this.fields[req.body.fieldIdx].value += (this.fields[req.body.fieldIdx].price / 2) * this.fields[req.body.fieldIdx].shops.length;

                game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick + " (" + this.skinName[game.playerList[req.body.player_id].skin] + ") rozbudował " +
                    this.fields[req.body.fieldIdx].name + " za " + String(price) + "$";
                break;
            case "prison": //gracz wywołał akcję PRISON
                this.prison.push(req.body.player_id)
                this.time_inprison.push({ who: req.body.player_id, time: 1 })
                game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick + " (" + this.skinName[game.playerList[req.body.player_id].skin] + ") trafił do więzienia! ";
                break;
            case "lose": //gracz stracił całe pieniądze
                game.playerList[req.body.player_id].dead = true;
                game.playerList[req.body.player_id].cash = 0;
                this.dead.push(req.body.player_id);
                game.lastAction = "Gracz " + game.playerList[req.body.player_id].nick + " (" + this.skinName[game.playerList[req.body.player_id].skin] + ") zbankurotwał! ";
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

        res.send(JSON.stringify({ id: id }))
    }
    getRandomCard = () => {
        let index = this.getRandomInt(0, 19);
        let card = Utils.getCard(index);
        return card;
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = GamePostService;