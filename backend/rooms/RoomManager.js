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
}

module.exports = RoomManager