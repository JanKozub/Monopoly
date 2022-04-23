const express = require('express');
const path = require("path");
const bodyParser = require("body-parser")
const session = require('express-session');
const favicon = require('serve-favicon');
const hbs = require('express-handlebars');
const GetService = require('./backend/GetService.js');
const PostService = require('./backend/PostService.js');
const DatabaseService = require("./backend/database/DatabaseService");
const postService = new PostService(new DatabaseService());

let app = express();

app.use(express.static('static'))
app.use(express.static('static/views'))
app.use(express.static('static/resources'))
app.use(favicon(__dirname + '/static/resources/icon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "420",
}));

app.set('views', path.join(__dirname, 'static/views'));
app.engine('hbs', hbs({defaultLayout: 'main.hbs'}));
app.set('view engine', 'hbs');

app.listen(3000, () => {
    console.log("start serwera na porcie " + 3000)
})

app.get('/', (req, res) => GetService.defaultHandler(req, res));
app.get('/rooms', (req, res) => GetService.defaultHandler(req, res));

app.post("/login", (req, res) => postService.onLogin(req, res))
app.post("/register", (req, res) => postService.onRegister(req, res))
app.post("/createRoom", (req, res) => postService.createRoom(req, res))
app.post("/loadRooms", (req, res) => postService.loadRooms(req, res))
app.post("/getUser", (req, res) => postService.getUser(req, res))
app.post("/logout", (req, res) => postService.logout(req, res))

app.use((req, res) => GetService.defaultHandler(req, res))