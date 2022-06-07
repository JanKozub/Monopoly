class RoomManager {
    rooms = []

    addRoom(room) {
        const r = this.getRoomByName(room.name);
        if (r === null) {
            this.rooms.push(room)
            return 'success';
        } else {
            return 'name exists';
        }
    }

    getRooms() {
        return this.rooms;
    }

    getRoomByName(name) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].name === name) {
                return this.rooms[i];
            }
        }
        return null;
    }

    getRoomById(id) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].id === id) {
                return this.rooms[i];
            }
        }
        return null;
    }

    joinToRoom(id, user) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].id === id) {
                if (!this.isUserInRoom(id, user)) {
                    this.rooms[i].users.push(
                        {
                            ready: (user.nick === this.rooms[i].leader),
                            user: user
                        }
                    );
                }
                return this.rooms[i];
            }
        }
        return null;
    }

    getReady(id, user) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].id === id) {
                for (let k = 0; k < this.rooms[i].users.length; k++) {
                    if (this.rooms[i].users[k].user.id === user.id) {
                        this.rooms[i].users[k].ready = true;
                        return this.rooms[i];
                    }
                }
            }
        }
        return null;
    }

    isUserInRoom(id, user) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].id === id) {
                for (let k = 0; k < this.rooms[i].users.length; k++) {
                    if (this.rooms[i].users[k].user.id === user.id) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    logOutRoom(id, user) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].id === id) {
                this.rooms[i].users = this.rooms[i].users.filter(function (u) {
                    return u.user.id !== user.id;
                });
                if (this.rooms[i].leader === user.nick) {
                    this.rooms = this.rooms.filter(function (r) {
                        return r.leader !== user.nick;
                    });
                }
            }
        }
    }

    kickUser(id, userId) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].id === id) {
                this.rooms[i].users = this.rooms[i].users.filter(function (u) {
                    return u.user.id !== userId;
                });
            }
        }
    }

    isAvatarInRoom(id, avatar) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].id === id) {
                for (let k = 0; k < this.rooms[i].users.length; k++) {
                    if (parseInt(this.rooms[i].users[k].user.avatar) === parseInt(avatar)) {
                        return true
                    }
                }
                return false;
            }
        }
    }
}

module.exports = RoomManager