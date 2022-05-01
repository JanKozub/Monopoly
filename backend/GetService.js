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
                this.roomManager.logOutRoom(user.roomId, user);
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
                this.roomManager.logOutRoom(user.roomId, user);
            }
            res.render('room.hbs');
        } else {
            res.render('welcome.hbs');
        }
    }
}

module.exports = GetService;