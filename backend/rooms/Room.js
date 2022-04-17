const Utils = require('../Utils.js')

class Room {
    name;
    password;
    users;
    status;
    id;
    leader;

    constructor(name, password, leader) {
        this.password = password;
        this.users = [];
        this.status = 'created';
        this.id = Utils.generateId();
        this.name = name;
        this.leader = leader;
    }


    get name() {
        return this.name;
    }
}

module.exports = Room