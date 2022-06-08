const express = require('express');
const path = require("path");
const bodyParser = require("body-parser")
const session = require('express-session');
const favicon = require('serve-favicon');
const hbs = require('express-handlebars');

const GetService = require('./backend/GetService.js');
const PostService = require('./backend/PostService.js');
const GamePostService = require('./backend/GamePostService.js');

const DatabaseService = require("./backend/database/DatabaseService");
const GameDBService = require("./backend/database/GameDBService.js");

const RoomManager = require("./backend/rooms/RoomManager.js");
const GamesManager = require("./backend/GamesManager.js");


const roomManager = new RoomManager();
const gamesManager = new GamesManager();
const postService = new PostService(new DatabaseService(), roomManager, gamesManager);
const gamePostService = new GamePostService(new GameDBService(), gamesManager);
const getService = new GetService(roomManager);

let app = express();

app.use(express.static('resources'))
app.use(express.static('game'))
app.use(express.static('gui'))

app.use(favicon(__dirname + '/resources/common/icon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "420",
}));

app.set('views', path.join(__dirname, '/gui/views'));
app.engine('hbs', hbs({defaultLayout: 'main.hbs'}));
app.set('view engine', 'hbs');

app.listen(3000, () => {
    console.log("start serwera na porcie " + 3000)
})

app.get('/', (req, res) => getService.defaultHandler(req, res));
app.get('/rooms', (req, res) => getService.defaultHandler(req, res));
app.get('/room', (req, res) => getService.roomHandler(req, res));
app.get('/game', (req, res) => getService.gameHandler(req, res));

app.post("/login", (req, res) => postService.onLogin(req, res))
app.post("/register", (req, res) => postService.onRegister(req, res))
app.post("/createRoom", (req, res) => postService.createRoom(req, res))
app.post("/loadRooms", (req, res) => postService.loadRooms(req, res))
app.post("/getUser", (req, res) => postService.getUser(req, res))
app.post("/changeAvatar", (req, res) => postService.changeAvatar(req, res))
app.post("/isAvatarInRoom", (req, res) => postService.isAvatarInRoom(req, res))
app.post("/logout", (req, res) => postService.logout(req, res))
app.post("/joinToRoom", (req, res) => postService.joinToRoom(req, res))
app.post("/getUsersInRoom", (req, res) => postService.getRoom(req, res))
app.post("/getReady", (req, res) => postService.getReady(req, res))
app.post("/kickUser", (req, res) => postService.kickUser(req, res))
app.post("/startNewGame", (req, res) => postService.startNewGame(req, res))
app.post("/isGameStarted", (req, res) => postService.isGameStarted(req, res))

//game
app.post("/init", (req, res) => gamePostService.initGame(req, res))
app.post("/getFields", (req, res) => gamePostService.getFields(req, res))
app.post("/cubeScore", (req, res) => gamePostService.cubeScore(req, res))
app.post("/update", (req, res) => gamePostService.update(req, res))
app.post("/nexttura", (req, res) => gamePostService.nextTura(req, res))
app.post("/setcubes", (req, res) => gamePostService.setCubes(res, res))
app.post("/setposition", (req, res) => gamePostService.setPosition(req, res))
app.post("/action", (req, res) => gamePostService.action(req, res))
app.post("/getPlayerId", (req, res) => gamePostService.getPlayerId(req, res))

app.use((req, res) => getService.defaultHandler(req, res))