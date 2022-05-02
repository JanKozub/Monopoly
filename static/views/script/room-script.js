let id = undefined;
let room = undefined;
let currentUser = undefined;

window.onload = async () => {
    id = window.location.href.split('=')[1];
    let data = await Net.getPostData('/joinToRoom', {id: id});

    room = data.room
    currentUser = data.user

    renderTopBar();
    renderPlayers();

    document.getElementById('exit-button').onclick = () => {
        window.location.href = '/rooms'
    }

    setInterval(() => updateUsersInRoom(), 500);
}

function renderTopBar() {
    document.getElementById('name').innerText = room.name;
    document.getElementById('id').innerText = "ID: " + room.id;
    document.getElementById('players').innerText = "Gracze: " + room.users.length + "/" + room.size;
    document.getElementById('leader').innerText = "Lider: " + room.leader;

    if (currentUser.nick === room.leader) {
        document.getElementById('start-button').innerText = 'Rozpocznij grę!'
    }
}

async function updateUsersInRoom() {
    const data = await Net.getPostData('/getUsersInRoom', {id: id});

    room = data.room
    document.getElementById('users').innerHTML = ''
    document.getElementById('players').innerText = "Gracze: " + room.users.length + "/" + room.size;
    renderPlayers();
}

function renderPlayers() {
    const users = room.users.sort((a, b) => {
        if (a.user.nick === room.leader) {
            return -1;
        }

        if (b.user.nick === room.leader) {
            return 1;
        }

        return 0
    })
    for (let user of users) {
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

        const status = document.createElement('div');
        status.className = 'u-row-ready';
        status.innerText = user.ready || user.user.nick === room.leader ? '✔' : '✖';

        row.append(status);

        document.getElementById('users').append(row);
    }
}
