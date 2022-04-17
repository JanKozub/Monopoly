class GetService {
    static defaultHandler(req, res) {
        console.log('opened ' + req.url)

        if (req.session.user) {
            res.render('lobbies.hbs');
        } else {
            res.render('welcome.hbs');
        }
    }
}

module.exports = GetService;