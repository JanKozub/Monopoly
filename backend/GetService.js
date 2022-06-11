class GetService {
    roomManager;
    gamesManager;

    constructor(roomManager, gamesManager) {
        this.roomManager = roomManager;
        this.gamesManager = gamesManager;
    }

    defaultHandler(req, res) {
        console.log('opened ' + req.url)

        const user = req.session.user;

        if (user) {
            if (user.roomId !== undefined && user.roomId !== null) {
                this.roomManager.removeUser(user.roomId, user);
                req.session.user.roomId = undefined;
            }
            res.render('rooms.hbs');
        } else {
            res.render('welcome.hbs');
        }
    }

    roomHandler(req, res) {
        console.log('opened ' + req.url)

        const user = req.session.user;

        if (user) {
            if (user.roomId !== undefined && user.roomId !== null) {
                this.roomManager.removeUser(user.roomId, user);
                req.session.user.roomId = undefined;
            }
            res.render('room.hbs');
        } else {
            console.log('user not logged in - rendering welcome')
            res.render('welcome.hbs');
        }
    }

    gameHandler(req, res) {
        const user = req.session.user;
        if (user) {
            if (this.gamesManager.isPlayerInGame(req.url.split('=')[1], user.id)) {
                this.roomManager.removeRoom(user.roomId);
                req.session.user.roomId = undefined;
                res.render('game.hbs');
            } else {
                res.render('rooms.hbs');
            }
        } else {
            console.log('user not logged in - rendering welcome')
            res.render('welcome.hbs');
        }
    }
}

module.exports = GetService;