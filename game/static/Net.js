let contentUpdate;

class Net {
    constructor() {
        this.nickname = "Tupta"; //POBRANIE NICKU Z MENU
        this.skin = "hotdog"; //POBRANIE SKINA Z MENU
        this.player_id = 0; //POBRANIE ID Z MENU
        this.tura = 0;
        this.actual_cubes = [2, 2]
        this.playercount = 2;
        this.init().then();
        contentUpdate = setInterval(this.update, 200);
        this.turaSeconds = 30;
    }

    init = async () => { //PIERWSZE POŁĄCZENIE Z SERWEREM - PRZESŁANIE DO SERWERA DANYCH GRACZA - odebranie playerlist
        let data = JSON.stringify({
            nickname: this.nickname,
            skin: this.skin,
            player_id: this.player_id
        })
        playerlist = await sendFetch(data, "/init")
    }
    sendCubeScore = async (a, b) => { //PRZESŁANIE DO SERWERA WYLOSOWANYCH OCZEK KOSTEK
        let data = JSON.stringify({
            nickname: this.nickname,
            skin: this.skin,
            player_id: this.player_id,
            cube_scores: [a, b]
        })
        await sendFetch(data, "/cubeScore")
    }
    throwCubes = (a, b) => {
        let cubes3D = game.cubes.getChildren();
        cubes_in_move = true;
        animToIndex(cubes3D[0], a - 1, 0, 0, 0).then();
        animToIndex(cubes3D[1], b - 1, 30, 50, 200).then();
        this.actual_cubes = [a, b];
        if (this.tura === this.player_id) {
            this.sendCubeScore(a, b).then()
            this.turaSeconds = 30;
            this.turaTime = setInterval(() => {
                if (this.turaSeconds > 0) {
                    this.turaSeconds--;
                    console.log(this.turaSeconds)
                } else {
                    clearInterval(this.turaTime);
                    this.nexttura().then();
                    ui.hideBuymenu()
                }
            }, 1000)
        }
    }
    update = async () => { //FETCH POBIERA Z SERWERA: TURA,PLAYERLIST,
        let dane = JSON.stringify({
            nickname: this.nickname,
        })
        let data = await sendFetch(dane, "/update");
        if (data !== "error") {
            ui.toggleThrowbutton(this.tura, this.player_id);
            this.compareCubes(data); //porównuje kostki u gracza z serwerem
            this.overwrite(data); //nadpisuje stałe klienta nowymi z serwera
            this.comparePosition(data); //koryguje pozycję pionków do aktualnej z serwera
            this.updateCashAndEQ(data); //nadpisuje EQ oraz Cash wszystkich graczy
            this.showLatestNews(data); //wyświetla informacje o stanie gry
        }
    }
    overwrite = (data) => {
        this.tura = data.tura;
        fields = data.fields;
    }
    compareCubes = (data) => {
        if (this.actual_cubes[0] !== data.cubes[0] || this.actual_cubes[1] !== data.cubes[1]) { //kostki na serwerze inne niż u gracza
            this.actual_cubes = [data.cubes[0], data.cubes[1]]
            this.throwCubes(data.cubes[0], data.cubes[1])
        }
    }
    comparePosition = (data) => {
        for (let id = 0; id < this.playercount; id++) {
            if (playerlist[id].position !== data.playerlist[id].position && !in_move.includes(id)) { //pozycja gracza na serwerze inna niż u gracza
                in_move.push(id);
                let count = data.playerlist[id].position - playerlist[id].position;
                if (count < 0) {
                    count += 40
                }
                setTimeout(() => {
                    jumpToPoint(id, count)
                    stepengine(this.player_id, this.tura, data.playerlist[id].position - 1, id)
                }, 1500);
            }
        }
    }
    updateCashAndEQ = (data) => {
        ui.updateCash(this.player_id);
        for (let i = 0; i < playerlist.length; i++) {
            playerlist[i].eq = data.playerlist[i].eq;
            playerlist[i].cash = data.playerlist[i].cash;
        }
    }
    showLatestNews = (data) => { //sprawdza czy najnowszy news się zmienił i wyświetla jego treść jeśli tak
        if (lastAction !== data.lastAction) {
            lastAction = data.lastAction;
            console.log(lastAction);
        }
    }
    nexttura = async () => {
        let data = JSON.stringify({})
        await sendFetch(data, "/nexttura")
    }
    stopTuraCounter = () => {
        clearInterval(this.turaTime);
        this.nexttura();
    }
    setcubes = async (cueba, cubeb) => {
        let data = JSON.stringify({
            cubea: cueba,
            cubeb: cubeb
        })
        await sendFetch(data, "/setcubes")
    }
    setPosition = async (id, pos) => {
        let data = JSON.stringify({
            id: id,
            pos: pos
        })
        await sendFetch(data, "/setposition")
    }
}


sendFetch = async (data, url) => {
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