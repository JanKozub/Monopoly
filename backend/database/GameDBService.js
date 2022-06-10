const Datastore = require("nedb");

class GameDBService {
    fields;

    constructor() {
        this.fields = new Datastore({
            filename: 'backend/database/fields.db',
            autoload: true
        });
    }

    insert(obj) {
        this.fields.insert(obj, function (err, newDoc) {
            console.log("user added with db id: " + newDoc._id)
        });
    }

    async getFields() {
        return new Promise((resolve, reject) => {
                try {
                    this.fields.find({}).sort({id: 1}).exec(function (err, docs) {
                        resolve(docs)
                    })
                } catch
                    (ex) {
                    reject(ex)
                }
            }
        )
    }
}

module.exports = GameDBService