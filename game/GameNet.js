export class GameNet {
    playerList;
    cubesInMove;
    inMove = [];
    game;
    ui;
    lastAction;
    animations;
    stepEngine;
    contentUpdate;
    actual_cubes;

    constructor(game, playerList, animations) {
        this.playerList = playerList;
        this.game = game;
        this.animations = animations;
        this.animations.setGameNet(this);

        this.player_id = 0; //POBRANIE ID Z MENU
        this.tura = 0;
        this.actual_cubes = [2, 2]
        this.playercount = 1;
        this.contentUpdate = setInterval(this.update, 200);
        this.turaSeconds = 30;
    }

    setUi(ui) {
        this.ui = ui;
    }

    setStepEngine(stepEngine) {
        this.stepEngine = stepEngine;
    }

    sendCubeScore = async (a, b) => { //PRZESŁANIE DO SERWERA WYLOSOWANYCH OCZEK KOSTEK
        let data = JSON.stringify({
            player_id: this.player_id,
            cube_scores: [a, b]
        })
        console.log(data)
        await GameNet.sendFetch(data, "/cubeScore")
    }

    throwCubes = (a, b) => {
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
                    this.nexttura().then();
                    this.ui.hideBuymenu()
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
            this.ui.toggleThrowbutton(this.tura, this.player_id);
            this.compareCubes(data); //porównuje kostki u gracza z serwerem
            this.overwrite(data); //nadpisuje stałe klienta nowymi z serwera
            this.comparePosition(data); //koryguje pozycję pionków do aktualnej z serwera
            this.updateCashAndEQ(data); //nadpisuje EQ oraz Cash wszystkich graczy
            this.showLatestNews(data); //wyświetla informacje o stanie gry
        }
    }

    overwrite = (data) => {
        this.tura = data.tura;
        this.game.fields = data.fields;
    }

    compareCubes = (data) => {
        if (this.actual_cubes[0] !== data.cubes[0] || this.actual_cubes[1] !== data.cubes[1]) { //kostki na serwerze inne niż u gracza
            this.actual_cubes = [data.cubes[0], data.cubes[1]]
            this.throwCubes(data.cubes[0], data.cubes[1])
        }
    }

    comparePosition = (data) => {
        for (let id = 0; id < this.playercount; id++) {
            console.log(this.inMove)
            if (this.playerList[id].position !== data.playerList[id].position && !this.inMove.includes(id)) { //pozycja gracza na serwerze inna niż u gracza
                this.inMove.push(id);
                let count = data.playerList[id].position - this.playerList[id].position;
                if (count < 0) {
                    count += 40
                }
                setTimeout(() => {
                    this.animations.jumpToPoint(id, count, this.game.players)
                    this.stepEngine.step(this.player_id, this.tura, data.playerList[id].position - 1, id)
                }, 1500);
            }
        }
    }

    updateCashAndEQ = (data) => {
        this.ui.updateCash(this.player_id);
        for (let i = 0; i < this.playerList.length; i++) {
            this.playerList[i].eq = data.playerList[i].eq;
            this.playerList[i].cash = data.playerList[i].cash;
        }
    }

    showLatestNews = (data) => { //sprawdza czy najnowszy news się zmienił i wyświetla jego treść jeśli tak
        if (this.lastAction !== data.lastAction) {
            this.lastAction = data.lastAction;
        }
    }

    nexttura = async () => {
        let data = JSON.stringify({})
        await GameNet.sendFetch(data, "/nexttura")
    }

    stopTuraCounter = () => {
        clearInterval(this.turaTime);
        this.nexttura().then();
    }

    setcubes = async (cueba, cubeb) => {
        let data = JSON.stringify({
            cubea: cueba,
            cubeb: cubeb
        })
        await GameNet.sendFetch(data, "/setcubes")
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
                })
                .catch(() => resolve("error"));
        })
    }
}