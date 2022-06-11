class GetService {
    roomManager;

    constructor(roomManager) {
        this.roomManager = roomManager;
    }

    defaultHandler(req, res) {
        console.log('opened ' + req.url)

        const user = req.session.user;

        if (user) {
            if (user.roomId !== undefined) {
                this.roomManager.removeUserFromRoom(user.roomId, user);
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
            if (user.roomId !== undefined) {
                this.roomManager.removeUserFromRoom(user.roomId, user);
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
            this.roomManager.removeRoom(user.roomId);
            req.session.user.roomId = undefined;
            console.log(this.roomManager.rooms)
            res.render('game.hbs');
        } else {
            console.log('user not logged in - rendering welcome')
            res.render('welcome.hbs');
        }
    }
}

module.exports = GetService;