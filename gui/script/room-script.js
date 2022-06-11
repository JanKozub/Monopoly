let id = undefined;
let room = undefined;
let currentUser = undefined;

window.onload = async () => {
    id = window.location.href.split('=')[1];
    let data = await Net.sendPostData('/joinToRoom', {id: id});
    if (data.response === 'room not found') {
        roomClosed()
    } else {
        room = data.room
        currentUser = data.user

        document.getElementById('exit-button').onclick = () => window.location.href = '/rooms'
        document.getElementById('start-button').onclick = setReady;

        renderTopBar();
        renderPlayers();

        setInterval(() => updateUsersInRoom(), 500);
    }
}

function renderTopBar() {
    document.getElementById('name').innerText = room.name;
    document.getElementById('id').innerText = "ID: " + room.id;
    document.getElementById('players').innerText = "Gracze: " + room.users.length + "/" + room.size;
    document.getElementById('leader').innerText = "Lider: " + room.leader;

    if (currentUser.nick === room.leader) {
        const button = document.getElementById('start-button')
        button.innerText = 'Rozpocznij grę!';
        button.onclick = startGame;
    }
}

async function updateUsersInRoom() {
    const data = await Net.sendPostData('/getUsersInRoom', {id: id});
    if (data.response === 'room not found')
        roomClosed()
    else if (data.response === 'user kicked')
        userKicked();

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
        img.src = '../avatars/avatar-' + user.user.avatar + '.jpg'
        row.append(img)

        const type = document.createElement('img');
        type.className = 'u-row-type';
        type.src = user.user.nick === room.leader ? "../room/crown.png" : "../room/user.png";
        row.append(type);

        const nick = document.createElement('p');
        nick.className = 'u-row-nick';
        nick.innerText = user.user.nick;
        row.append(nick);

        if (user.user.nick !== room.leader && currentUser.nick === room.leader) {
            const kickButton = document.createElement('button');
            kickButton.className = 'kick-button';
            kickButton.innerText = 'Wyrzuć';
            kickButton.onclick = () => kick(user.user.id);
            row.append(kickButton)
        }

        const status = document.createElement('div');
        status.className = 'u-row-ready';
        status.innerText = user.ready || user.user.nick === room.leader ? '✔' : '✖';

        row.append(status);

        document.getElementById('users').append(row);
    }
}

async function startGame() {
    if (room.users.length === parseInt(room.size)) {
        let readyUsersCounter = await Net.sendPostData('/getReadyUsers', {id: id}).then()
        if (readyUsersCounter.readyUsers === parseInt(room.size)) {
            console.log('starting game...')
            let id = window.location.href.split('=')[1]
            Net.sendPostData('/startNewGame', {id: id}).then()
            window.location.href = '/game?id=' + id;
        } else {
            showPopup('Nie wszyscy są gotowi!', 'inform', 3000).then();
        }
    } else {
        showPopup('Niewystarczająca ilość graczy!', 'inform', 3000).then();
    }
}

async function setReady() {
    await Net.sendPostData('/getReady', {id: id});
    let inter = setInterval(async () => {
        let status = await Net.sendPostData('/isGameStarted', {id: id})

        if (status.response) {
            clearInterval(inter);
            window.location.href = '/game?id=' + id;
        }
    }, 100);
}

function roomClosed() {
    window.location.href = '/rooms?roomClosed';
}

function kick(userId) {
    Net.sendPostData('/kickUser', {id: id, userId: userId}).then();
}

function userKicked() {
    window.location.href = '/rooms?userKicked';
}