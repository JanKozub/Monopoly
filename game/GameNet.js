export class GameNet {
    playerList;
    cubesInMove;
    inMove = [];
    game;
    ui;
    lastAction;
    lastCard;
    animations;
    stepEngine;
    contentUpdate;
    actual_cubes;
    old_fields;
    instantWin = 0;
    lastRead = 0;

    constructor(game, playerList, animations) {
        this.playerList = playerList;
        this.game = game;
        this.animations = animations;
        this.animations.setGameNet(this);

        this.player_id = game.myId;
        this.tura = 0;
        this.lastThrow = -1;
        this.actual_cubes = [2, 2]
        this.contentUpdate = setInterval(this.update, 200);
        this.turaSeconds = 30;
        this.onlyFree = -1;
    }

    setUi(ui) {
        this.ui = ui;
    }

    setStepEngine(stepEngine) {
        this.stepEngine = stepEngine;
    }

    sendCubeScore = async (a, b) => { //PRZESŁANIE DO SERWERA WYLOSOWANYCH OCZEK KOSTEK
        if (this.lastThrow !== this.player_id) {
            clearInterval(this.turaTime);
            let data = JSON.stringify({
                player_id: this.player_id,
                cube_scores: [a, b]
            })
            await GameNet.sendFetch(data, "/cubeScore")
        }
    }

    throwCubes = async (a, b) => {
        let cubes3D = this.game.cubes.getChildren();
        this.cubesInMove = true;
        this.animations.animToIndex(cubes3D[0], a - 1, 0, 0, 0).then();
        this.animations.animToIndex(cubes3D[1], b - 1, 30, 50, 200).then();
        this.actual_cubes = [a, b];
        if (this.tura === this.player_id) {
            this.sendCubeScore(a, b).then()
            this.turaSeconds = 30;
            this.turaTime = setInterval(() => {
                if (this.turaSeconds > 0) {
                    this.turaSeconds--;
                } else {
                    clearInterval(this.turaTime);
                    this.nextTura().then();
                    this.ui.hideBuyMenu();
                    this.ui.hideBuildMenu();
                }
            }, 1000)
        }
    }

    update = async () => { //FETCH POBIERA Z SERWERA: TURA,playerList,
        let dane = JSON.stringify({
            id: this.player_id,
        })
        let data = await GameNet.sendFetch(dane, "/update");
        if (data !== "error") {
            let win = await this.checkWin(data);
            if (win) {
                this.ui.toggleThrowButton(this.tura, this.player_id);
                this.compareCubes(data); //porównuje kostki u gracza z serwerem
                this.overwrite(data); //nadpisuje stałe klienta nowymi z serwera
                this.comparePosition(data); //koryguje pozycję pionków do aktualnej z serwera
                this.updateUI(data); //nadpisuje EQ oraz Cash wszystkich graczy
                this.showLatestNews(data); //wyświetla informacje o stanie gry
                await this.checkIfLose();
                await this.updateHouses();
            }
        }
    }

    overwrite = (data) => {
        this.old_fields = this.game.fields;
        this.tura = data.tura;
        this.game.fields = data.fields;
        this.lastThrow = data.lastThrow;
        this.onlyFree = data.onlyFree;
        this.stepEngine.update(data.fields);
    }

    compareCubes = (data) => {
        if (this.actual_cubes[0] !== data.cubes[0] || this.actual_cubes[1] !== data.cubes[1]) { //kostki na serwerze inne niż u gracza
            this.actual_cubes = [data.cubes[0], data.cubes[1]]
            this.throwCubes(data.cubes[0], data.cubes[1]).then()
        }
    }

    comparePosition = (data) => {
        for (let id = 0; id < this.playerList.length; id++) {
            if (this.playerList[id].position !== data.playerList[id].position && !this.inMove.includes(id)) { //pozycja gracza na serwerze inna niż u gracza
                this.inMove.push(id);

                let count = data.playerList[id].position - this.playerList[id].position;
                if (count < 0) {
                    count += 40
                }
                setTimeout(() => {
                    this.animations.jumpToPoint(id, count, this.game.players)
                    this.stepEngine.step(this.player_id, this.tura, data.playerList[id].position - 1)
                }, 1500);
            }
        }
    }

    updateUI = (data) => {
        this.ui.updateCash(this.player_id);
        this.ui.updateThrowButton(this.lastThrow, this.player_id, this.tura);
        this.ui.updateEnemyList(this.playerList, this.player_id);
        if (this.player_id !== this.tura) {
            this.ui.hideBuyMenu()
        }
        for (let i = 0; i < this.playerList.length; i++) {
            this.playerList[i].eq = data.playerList[i].eq;
            this.playerList[i].cash = data.playerList[i].cash;
        }
    }

    updateHouses = async () => {
        for (let i in this.game.fields) {
            if (this.game.fields[i].shops.length !== this.old_fields[i].shops.length) {
                let tempShops = this.game.fields[i].shops;
                let house = await this.game.houses.genHouse(tempShops[tempShops.length - 1], parseInt(i), this.game.fields[i].shops.length - 1);
                this.animations.raiseFromBottom(house, 4);
            }
        }
    }

    showLatestNews = (data) => { //sprawdza czy najnowszy news się zmienił i wyświetla jego treść jeśli tak
        if (this.lastAction !== data.lastAction) {
            this.lastAction = data.lastAction;
            if (data.lastAction !== "") {
                showPopup(data.lastAction, 'inform', 3000).then();
            }
        }
        if (this.lastCard !== data.lastCard) {
            this.lastCard = data.lastCard;
            if (data.lastCard !== "") {
                showPopup(data.lastCard, 'card', 6000).then();
            }
        }
    }

    checkIfLose = async () => {
        if (this.playerList[this.player_id].cash <= 0) {
            let data = JSON.stringify({
                action: "lose",
                player_id: this.player_id,
            })
            await GameNet.sendFetch(data, "/action")
        }
    }

    checkWin = async (data) => {
        if (data.win !== -1) {
            await this.endProcedure(data.win)
            return false;
        } else if (this.instantWin === 1) { //insta win key shortcut
            this.instantWin = 0;
            await GameNet.sendFetch(JSON.stringify({id: window.location.href.split('=')[1]}), "/endGame")
            await this.endProcedure(0)
            return false;
        } else {
            return true;
        }
    }

    async endProcedure(id) {
        await GameNet.sendFetch(JSON.stringify({id: window.location.href.split('=')[1]}), "/deleteGame")

        let msg;
        if (id === this.player_id) {
            msg = 'Wygrales grę!'
        } else {
            msg = 'Przegrałeś :('
        }

        this.ui.showWinPrompt(msg);
        clearInterval(this.contentUpdate)
        setTimeout(() => {
            window.location.href = '/rooms'
        }, 5000);
    }

    nextTura = async () => {
        clearInterval(this.turaTime);
        if (this.tura === this.player_id) {
            let data = JSON.stringify({
                player_id: this.player_id
            })
            await GameNet.sendFetch(data, "/nextTura")
        }
    }

    setPosition = async (id, pos) => {
        let data = JSON.stringify({
            id: id,
            pos: pos
        })
        await GameNet.sendFetch(data, "/setposition")
    }

    async getFields() {
        let data = JSON.stringify({})
        return await GameNet.sendFetch(data, '/getFields')
    }

    static sendFetch = async (data, url) => {
        return new Promise(resolve => {
            const options = {
                method: "POST", body: data, headers: {'Content-Type': 'application/json'}
            };
            fetch(url, options) //fetch engine
                .then(response => response.json())
                .then(data => {
                    resolve(data)
                }).catch(() => resolve("error"));
        })
    }
}
