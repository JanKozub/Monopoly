const Utils = require('../Utils.js')

class Room {
    name;
    password;
    users;
    status;
    id;
    leader;
    size;

    constructor(name, password, leader, size) {
        this.password = password;
        this.users = [];
        this.status = 'created';
        this.id = Utils.generateId();
        this.name = name;
        this.leader = leader;
        this.size = size;
    }


    get name() {
        return this.name;
    }
}

module.exports = Room