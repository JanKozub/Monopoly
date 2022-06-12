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

    async getUserWithId(id) {
        return await new Promise((resolve, reject) => {
            try {
                this.users.findOne({id: id}, function (err, doc) {
                    resolve(doc)
                });
            } catch (ex) {
                reject(ex)
            }
        })
    }

    async getUserFromDataBase(nick) {
        return await new Promise((resolve, reject) => {
            try {
                this.users.findOne({nick: nick}, function (err, doc) {
                    resolve(doc)
                });
            } catch (ex) {
                reject(ex)
            }
        })
    }

    async

    async updateAvatar(id, avatar) {
        return new Promise((resolve, reject) => {
            try {
                this.users.update({id: id}, {$set: {avatar: parseInt(avatar)}}, {},
                    function (err, numReplaced) {
                        resolve(numReplaced)
                    }
                );
            } catch (ex) {
                reject(ex)
            }
        })
    }

    async updateStat(id, stat, data) {
        return new Promise((resolve, reject) => {
            try {
                if (stat === 'gamesPlayed') {
                    this.users.update({id: id}, {$set: {gamesPlayed: data}}, {},
                        function (err, numReplaced) {
                            resolve(numReplaced)
                        }
                    );
                } else if (stat === 'gamesWon') {
                    this.users.update({id: id}, {$set: {gamesWon: data}}, {},
                        function (err, numReplaced) {
                            resolve(numReplaced)
                        }
                    );
                } else if (stat === 'moneySum') {
                    this.users.update({id: id}, {$set: {moneySum: data}}, {},
                        function (err, numReplaced) {
                            resolve(numReplaced)
                        }
                    );
                } else if (stat === 'placesBoughtSum') {
                    this.users.update({id: id}, {$set: {placesBoughtSum: data}}, {},
                        function (err, numReplaced) {
                            resolve(numReplaced)
                        }
                    );
                } else if (stat === 'rollCounter') {
                    this.users.update({id: id}, {$set: {rollCounter: data}}, {},
                        function (err, numReplaced) {
                            resolve(numReplaced)
                        }
                    );
                } else if (stat === 'rolledNumSum') {
                    this.users.update({id: id}, {$set: {rolledNumSum: data}}, {},
                        function (err, numReplaced) {
                            resolve(numReplaced)
                        }
                    );
                }
            } catch (ex) {
                reject(ex)
            }
        })
    }
}

module.exports = DatabaseService