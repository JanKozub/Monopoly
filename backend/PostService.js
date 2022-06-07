const Utils = require("./Utils.js");
const Room = require("./rooms/Room.js")
const GamesManager = require("./GamesManager.js")

class PostService {
    databaseService;
    roomManager;
    gamesManager;

    constructor(databaseService, roomManager, gamesManager) {
        this.databaseService = databaseService;
        this.roomManager = roomManager;
        this.gamesManager = gamesManager;
    }

    async onLogin(req, res) {
        res.setHeader("content-type", "text/plain")

        const user = await this.databaseService.getUserFromDataBase(req.body.nick)

        if (user === null) {
            res.send(JSON.stringify({response: "user does not exist"}))
        } else {
            if (user.password === req.body.password) {
                req.session.user = user;
                res.send(JSON.stringify({response: "success"}))
            } else {
                res.send(JSON.stringify({response: "wrong password"}))
            }
        }
    }

    async onRegister(req, res) {
        res.setHeader("content-type", "text/plain")

        const user = {
            nick: req.body.nick,
            password: req.body.password,
            id: Utils.generateId(),
            roomId: 0,
            avatar: 0,
            gamesPlayed: 0,
            gamesWon: 0,
            moneySum: 0,
            placesBoughtSum: 0,
            averageRoll: 0
        }

        if (await this.databaseService.isUserInDatabaseByNick(user.nick)) {
            res.send(JSON.stringify({response: "user exists"}))
        } else {
            this.databaseService.insert(user);
            req.session.user = user;
            res.send(JSON.stringify({response: "success"}))
        }
    }

    getUser(req, res) {
        res.setHeader("content-type", "text/plain")
        res.send(JSON.stringify(req.session.user))
    }

    changeAvatar(req, res) {
        const prev = req.session.user.avatar;
        req.session.user.avatar = req.body.avatar
        res.setHeader("content-type", "text/plain")
        res.send(JSON.stringify({prev: prev, next: req.body.avatar}))
    }

    logout(req, res) {
        req.session.user = undefined;
        res.setHeader("content-type", "text/plain")
        res.send(JSON.stringify({response: "success"}))
    }

    createRoom(req, res) {
        res.setHeader("content-type", "text/plain")

        const room = new Room(req.body.name, req.body.password, req.session.user.nick, req.body.size);
        const response = this.roomManager.addRoom(room);

        res.send(JSON.stringify({
            response: response,
            createdRoom: room,
            rooms: this.roomManager.getRooms()
        }))
    }

    loadRooms(req, res) {
        res.setHeader("content-type", "text/plain")
        res.send(JSON.stringify({rooms: this.roomManager.getRooms()}))
    }

    joinToRoom(req, res) {
        const id = req.body.id;
        const room = this.roomManager.joinToRoom(id, req.session.user);

        let response;
        if (room !== null) {
            req.session.user.roomId = id;
            response = {
                response: "success",
                room: room,
                user: req.session.user
            }
        } else {
            response = {
                response: "room not found",
                room: undefined,
                user: req.session.user
            }
        }

        res.setHeader("content-type", "text/plain")
        res.send(JSON.stringify(response))
    }

    getRoom(req, res) {
        const id = req.body.id;
        const room = this.roomManager.getRoomById(id);
        let response;

        if (!this.roomManager.isUserInRoom(id, req.session.user)) {
            response = {
                response: "user kicked",
                room: room,
                user: req.session.user
            }
        } else {
            req.session.user.roomId = id;
            response = {
                response: "success",
                room: room,
                user: req.session.user
            }
        }

        res.setHeader("content-type", "text/plain")
        res.send(JSON.stringify(response))
    }

    getReady(req, res) {
        const id = req.body.id;
        const room = this.roomManager.getReady(id, req.session.user);
        let response;
        if (room !== null) {
            req.session.user.roomId = id;
            response = {
                response: "success",
                room: room
            }
        } else {
            response = {
                response: "room not found",
                room: undefined
            }
        }

        res.setHeader("content-type", "text/plain")
        res.send(JSON.stringify(response))
    }

    kickUser(req, res) {
        this.roomManager.kickUser(req.body.id, req.body.userId);

        res.setHeader("content-type", "text/plain")
        res.send(JSON.stringify({response: "success"}))
    }

    startNewGame(req, res) {
        let id = req.body.id;
        this.gamesManager.addNewGame(id, this.roomManager.getRoomById(id).users);
        req.session.gameId = id;
        res.send(JSON.stringify({response: "ok"}))
    }

    isGameStarted(req, res) {
        let game = this.gamesManager.getGameById(req.body.id);
        if (game !== null) {
            req.session.gameId = game.id;
            res.send(JSON.stringify({response: true}));
        } else {
            res.send(JSON.stringify({response: false}));
        }
    }
}

module.exports = PostService;