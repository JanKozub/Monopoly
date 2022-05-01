class GetService {
    static defaultHandler(req, res) {
        console.log('opened ' + req.url)

        if (req.session.user) {
            res.render('rooms.hbs');
        } else {
            res.render('welcome.hbs');
        }
    }

    static roomHandler(req, res) {
        console.log('opened ' + req.url)

        if (req.session.user) {
            res.render('room.hbs');
        } else {
            res.render('welcome.hbs');
        }
    }
}

module.exports = GetService;