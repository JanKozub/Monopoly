const Utils = require("./Utils.js");
const Room = require("./rooms/Room.js")
const RoomManager = require("./rooms/RoomManager.js")


class PostService {

    databaseService;
    roomManager;

    constructor(databaseService) {
        this.databaseService = databaseService;
        this.roomManager = new RoomManager();
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
            id: Utils.generateId()
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

        const response = this.roomManager.addRoom(new Room(req.body.name, req.body.password, req.session.user.nick))

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
}

module.exports = PostService;