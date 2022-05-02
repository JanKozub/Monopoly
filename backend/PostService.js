const Utils = require("./Utils.js");
const Room = require("./rooms/Room.js")

class PostService {
    databaseService;
    roomManager;

    constructor(databaseService, roomManager) {
        this.databaseService = databaseService;
        this.roomManager = roomManager;
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
            roomId: undefined,
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

    async createRoom(req, res) {
        res.setHeader("content-type", "text/plain")

        const response = this.roomManager.addRoom(new Room(req.body.name, req.body.password, req.session.user.nick, req.body.size))

        res.send(JSON.stringify({response: response, rooms: this.roomManager.getRooms()}))
    }

    loadRooms(req, res) {
        res.setHeader("content-type", "text/plain")
        res.send(JSON.stringify({rooms: this.roomManager.getRooms()}))
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
}

module.exports = PostService;