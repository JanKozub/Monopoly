var express = require("express")
var app = express();


const PORT = 3000;
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
    console.log("webgl");
})

var fields = [
    { id: 0, name: "Start", owner: "brak", shops: [], price: 0, action: "add", value: 200 },
    { id: 1, name: "POLE", owner: "brak", shops: [{ name: "budka z kebabem" }, { name: "automat" }], price: 60, action: "none", value: 0 },
    { id: 2, name: "POLE", owner: "brak", shops: [], price: 0, action: "add", value: 100 },
    { id: 3, name: "POLE", owner: "brak", shops: [], price: 60, action: "none", value: 0 },
    { id: 4, name: "Budżet dla samorządu", owner: "brak", shops: [], price: 0, action: "take", value: 200 },
    { id: 5, name: "Toaleta na pracowniach", owner: "brak", shops: [], price: 200, action: "none", value: 0 },
    { id: 6, name: "POLE", owner: "brak", shops: [], price: 100, action: "none", value: 0 },
    { id: 7, name: "Szansa", owner: "brak", shops: [], price: 0, action: "card", value: 0 },
    { id: 8, name: "POLE", owner: "brak", shops: [], price: 100, action: "none", value: 0 },
    { id: 9, name: "POLE", owner: "brak", shops: [], price: 120, action: "none", value: 0 },
    { id: 10, name: "Spacerniak ZSŁ. Dla odwiedzających.", owner: "brak", shops: [], price: 0, action: "add", value: 200 },
    { id: 11, name: "POLE", owner: "brak", shops: [], price: 140, action: "none", value: 0 },
    { id: 12, name: "POLE", owner: "brak", shops: [], price: 150, action: "none", value: 0 },
    { id: 13, name: "POLE", owner: "brak", shops: [], price: 140, action: "none", value: 0 },
    { id: 14, name: "POLE", owner: "brak", shops: [], price: 160, action: "none", value: 0 },
    { id: 15, name: "POLE", owner: "brak", shops: [], price: 200, action: "none", value: 0 },
    { id: 16, name: "POLE", owner: "brak", shops: [], price: 180, action: "none", value: 0 },
    { id: 17, name: "POLE", owner: "brak", shops: [], price: 0, action: "none", value: 0 },
    { id: 18, name: "POLE", owner: "brak", shops: [], price: 180, action: "none", value: 0 },
    { id: 19, name: "POLE", owner: "brak", shops: [], price: 200, action: "none", value: 0 },
    { id: 20, name: "Parking przy Domu Pomocy.", owner: "brak", shops: [], price: 0, action: "none", value: 0 },
    { id: 21, name: "POLE", owner: "brak", shops: [], price: 220, action: "none", value: 0 },
    { id: 22, name: "POLE", owner: "brak", shops: [], price: 0, action: "card", value: 0 },
    { id: 23, name: "POLE", owner: "brak", shops: [], price: 220, action: "none", value: 0 },
    { id: 24, name: "POLE", owner: "brak", shops: [], price: 240, action: "none", value: 0 },
    { id: 25, name: "POLE", owner: "brak", shops: [], price: 200, action: "none", value: 0 },
    { id: 26, name: "POLE", owner: "brak", shops: [], price: 260, action: "none", value: 0 },
    { id: 27, name: "POLE", owner: "brak", shops: [], price: 260, action: "none", value: 0 },
    { id: 28, name: "POLE", owner: "brak", shops: [], price: 150, action: "none", value: 0 },
    { id: 29, name: "POLE", owner: "brak", shops: [], price: 280, action: "none", value: 0 },
    { id: 30, name: "Idziesz grabić liście!", owner: "brak", shops: [], price: 0, action: "none", value: 0 },
    { id: 31, name: "POLE", owner: "brak", shops: [], price: 300, action: "none", value: 0 },
    { id: 32, name: "POLE", owner: "brak", shops: [], price: 300, action: "none", value: 0 },
    { id: 33, name: "POLE", owner: "brak", shops: [], price: 0, action: "none", value: 0 },
    { id: 34, name: "POLE", owner: "brak", shops: [], price: 320, action: "none", value: 0 },
    { id: 35, name: "POLE", owner: "brak", shops: [], price: 200, action: "none", value: 0 },
    { id: 36, name: "POLE", owner: "brak", shops: [], price: 0, action: "card", value: 0 },
    { id: 37, name: "POLE", owner: "brak", shops: [], price: 350, action: "none", value: 0 },
    { id: 38, name: "POLE", owner: "brak", shops: [], price: 0, action: "take", value: 100 },
    { id: 39, name: "POLE", owner: "brak", shops: [], price: 400, action: "none", value: 0 },
]

var playerlist = [
    { id: 0, position: 1, skin: "hotdog", nick: "", eq: [5, 4, 6], cash: 1500 },
    { id: 1, position: 1, skin: "rj45", nick: "", eq: [], cash: 1500 },
    { id: 2, position: 1, skin: "kebab", nick: "", eq: [], cash: 1500 },
    { id: 3, position: 1, skin: "rezystor", nick: "", eq: [], cash: 1500 },
    { id: 4, position: -1, skin: "null", nick: "", eq: [], cash: 1500 },
    { id: 5, position: -1, skin: "null", nick: "", eq: [], cash: 1500 }
]
var tura = 0;
var playercount = 2;
var actual_cubes = [2, 2];
var lastAction = "";

var path = require("path")
app.use(express.json());
app.use(express.static('static'));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})

app.post("/init", function (req, res) {
    playerlist[req.body.player_id].skin = req.body.skin
    playerlist[req.body.player_id].nick = req.body.nickname
    res.send(JSON.stringify(playerlist))
})

app.post("/cubeScore", function (req, res) {
    console.log(req.body)
    playerlist[req.body.player_id].position += (req.body.cube_scores[0] + req.body.cube_scores[1]);

    if (playerlist[req.body.player_id].position >= 40) {
        playerlist[req.body.player_id].position -= 40;
        playerlist[req.body.player_id].cash += 200
        lastAction = "Gracz " + playerlist[req.body.player_id].nick + " (" + playerlist[req.body.player_id].skin + ") otrzymał 200$";
    }
    actual_cubes = [req.body.cube_scores[0], req.body.cube_scores[1]]
    console.log(playerlist, tura)
    res.send(JSON.stringify(""))
})

app.post("/update", function (req, res) {
    let data = { playerlist: playerlist, tura: tura, cubes: actual_cubes, fields: fields, lastAction: lastAction }
    res.send(JSON.stringify(data))
})


app.post("/nexttura", function (req, res) {
    tura++;
    console.log(tura)
    if (tura > playercount - 1) {
        tura = 0;
        console.log("im here")
    }
    res.send(JSON.stringify("a"))
})

app.post("/setcubes", function (req, res) {
    actual_cubes = [req.body.cubea, req.body.cubeb];
    res.send(JSON.stringify("a"))
})

app.post("/setposition", function (req, res) {
    playerlist[req.body.id].position = req.body.pos;
    res.send(JSON.stringify("a"))
})

app.post("/action", function (req, res) {
    switch (req.body.action) {
        case "buy": //gracz wywołał akcję BUY
            if (playerlist[req.body.player_id].cash >= fields[req.body.fieldIdx].price) {

                playerlist[req.body.player_id].cash -= fields[req.body.fieldIdx].price;
                playerlist[req.body.player_id].eq.push(req.body.fieldIdx);

                fields[req.body.fieldIdx].action = "take"
                fields[req.body.fieldIdx].value = 100 //WSTAWIC OPLATE NA PODSTAWIE LICZBY DOMKÓW I ID POLA
                fields[req.body.fieldIdx].owner = req.body.player_id;
                fields[req.body.fieldIdx].price = 0; //POLE STAJE SIE NIEKUPOWALNE

                lastAction =
                    "Gracz " + playerlist[req.body.player_id].nick + " (" + playerlist[req.body.player_id].skin + ") kupił " + fields[req.body.fieldIdx].name;
            }
            break;
        case "take": //gracz wywołał akcję TAKE
            playerlist[req.body.player_id].cash -= fields[req.body.fieldIdx].value;
            lastAction =
                "Gracz " + playerlist[req.body.player_id].nick + " (" + playerlist[req.body.player_id].skin + ") stracił " + fields[req.body.fieldIdx].value + "$";
            break;
        case "card": //gracz wywołał akcję CARD
            //losuj kartę z listy kart, zwróć treść (text), akcje (action)(take lub add) oraz wartość (value) (ile dodać/odjąć)
            break;
        case "add": //gracz wywołał akcję ADD
            playerlist[req.body.player_id].cash += req.body.value;
            lastAction =
                "Gracz " + playerlist[req.body.player_id].nick + " (" + playerlist[req.body.player_id].skin + ") otrzymał " + req.body.value + "$";
            break;


        // case "build": //gracz wywołał akcję BUILD
        //     playerlist[req.body.player_id].cash -= fields[req.body.fieldIdx].price;
        //     break;
    }
    if (tura > playercount - 1) {
        tura = 0;
    }
    res.send(JSON.stringify("a"))
})