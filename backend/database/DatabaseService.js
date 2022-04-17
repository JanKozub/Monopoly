const Datastore = require("nedb");

class DatabaseService {
    users;

    constructor() {
        this.users = new Datastore({
            filename: 'backend/database/users.db',
            autoload: true
        });
    }

    insert(obj) {
        this.users.insert(obj, function (err, newDoc) {
            console.log("user added with db id: " + newDoc._id)
        });
    }

    async isUserInDatabaseByNick(nick) {
        return new Promise((resolve, reject) => {
            try {
                this.users.findOne({nick: nick}, function (err, doc) {
                    if (doc === null) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            } catch (ex) {
                reject(ex)
            }
        })
    }

    async getUserFromDataBase(nick) {
        return new Promise((resolve, reject) => {
            try {
                this.users.findOne({nick: nick}, function (err, doc) {
                    resolve(doc)
                });
            } catch (ex) {
                reject(ex)
            }
        })
    }
}

module.exports = DatabaseService