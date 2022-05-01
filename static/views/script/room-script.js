let id = undefined;
let room = undefined;
window.onload = () => {
    id = window.location.href.split('=')[1];
    getRoomById(id);
}

function getRoomById() {
    $.ajax({
        url: '/getRoomById',
        type: 'POST',
        data: {id: id},
        success: function (data) {
            room = JSON.parse(data).room
            console.log(room)
            document.getElementById('name').innerText = room.name;
            document.getElementById('id').innerText = "ID: " + room.id;
            document.getElementById('players').innerText = "Gracze: " + room.users.length + "/" + room.size;
            document.getElementById('leader').innerText = "Lider: " + room.leader;
        }
    });
}