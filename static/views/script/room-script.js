let id = undefined;
let room = undefined;
window.onload = () => {
    id = window.location.href.split('=')[1];
    joinToRoom(id);

    document.getElementById('exit-button').onclick = () => {
        window.location.href = '/rooms'
    }

    setInterval(() => updateUsersInRoom(), 500);
}

function joinToRoom() {
    $.ajax({
        url: '/joinToRoom',
        type: 'POST',
        data: {id: id},
        success: function (data) {
            room = JSON.parse(data).room
            renderTopBar();
            renderPlayers();
        }
    });
}

function updateUsersInRoom() {
    $.ajax({
        url: '/getUsersInRoom',
        type: 'POST',
        data: {id: id},
        success: function (data) {
            room = JSON.parse(data).room
            document.getElementById('users').innerHTML = ''
            document.getElementById('players').innerText = "Gracze: " + room.users.length + "/" + room.size;
            renderPlayers();
        }
    });
}

function renderTopBar() {
    document.getElementById('name').innerText = room.name;
    document.getElementById('id').innerText = "ID: " + room.id;
    document.getElementById('players').innerText = "Gracze: " + room.users.length + "/" + room.size;
    document.getElementById('leader').innerText = "Lider: " + room.leader;
}

function renderPlayers() {
    for (let user of room.users) {
        const row = document.createElement('div');
        row.className = 'u-row'

        const img = document.createElement('img');
        img.className = 'u-row-img'
        img.src = 'resources/avatar-' + user.user.avatar + '.jpg'
        row.append(img)

        const nick = document.createElement('p');
        nick.className = 'u-row-nick';
        nick.innerText = user.user.nick;
        row.append(nick);

        const type = document.createElement('img');
        type.className = 'u-row-type';
        type.src = user.user.nick === room.leader ? "resources/crown.png" : "resources/user.png";
        row.append(type);

        const status = document.createElement('div')
        status.className = user.ready ? 'u-row-ready' : 'u-row-not-ready';
        status.innerText = user.ready ? '✔' : '✖';
        row.append(status);

        document.getElementById('users').append(row);
    }
}
