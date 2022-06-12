let interval = undefined;

window.onload = async () => {
    const type = window.location.href.split('?')[1]

    if (type === 'roomClosed') {
        showPopup('Pokój został zamknięty\nz powodu w wyjścia lidera', 'error', 3000).then();
    } else if (type === 'userKicked') {
        showPopup('Zostałeś wyrzucony', 'error', 3000).then();
    }

    document.getElementById('add-button').onclick = onAdd;
    document.getElementById('log-out').onclick = onLogOut;
    for (let i = 0; i < 6; i++)
        document.getElementById('avatar-' + i).onclick = () => changeAvatar(i);

    loadStats().then();

    interval = setInterval(async () => {
        const rooms = await Net.sendPostData('/loadRooms', {});
        renderRooms(rooms.rooms)
    }, 500);

    document.getElementById('close-prompt').onclick = () => {
        document.getElementById('join-prompt').style.visibility = 'hidden';
    }
}

async function loadStats() {
    const obj = await Net.sendPostData('/getUser', {});

    document.getElementById('welcome-msg').innerText = 'Witaj ' + obj.nick;
    document.getElementById('games-played').innerText = 'Gry zagrane: ' + obj.gamesPlayed;
    document.getElementById('win-proc').innerText = 'Gry wygrane(%): ' + getWinProc(parseInt(obj.gamesWon), parseInt(obj.gamesPlayed));
    document.getElementById('bought-sum').innerText = 'Liczba zakupów: ' + obj.placesBoughtSum;
    document.getElementById('games-won').innerText = 'Gry wygrane: ' + obj.gamesWon;
    document.getElementById('avg-roll').innerText = 'Średnie losowanie: ' + obj.averageRoll;
    document.getElementById('money-sum').innerText = 'Razem zebrano: ' + obj.moneySum;
    document.getElementById('avatar-' + obj.avatar).style.filter = 'brightness(70%)'
}

async function onAdd() {
    let name = document.getElementById('room-name-input');
    let password = document.getElementById('room-password-input');
    let size = document.getElementById('room-users-select');

    if (name.value !== '' && password.value !== '') {
        const obj = await Net.sendPostData('/createRoom',
            {name: name.value, password: password.value, size: size.value});

        if (obj.response === 'success') {
            clearInterval(interval);
            window.location.href = '/room?id=' + obj.createdRoom.id
        } else if (obj.response === 'name exists') {
            showPopup('Pokój z taką nazwą już istnieje', 'error', 5000).then();
        }
    } else {
        showPopup('Pola z nazwą i hasłem nie mogą być puste!', 'error', 5000).then();
    }
}

function renderRooms(rooms) {
    const lobbyList = document.getElementById('rooms-list');
    lobbyList.innerHTML = ''
    for (const room of rooms) {
        let row = document.createElement('div');
        row.className = 'row'

        let container = document.createElement('div');
        container.className = 'row-container'

        let name = document.createElement('p');
        name.className = 'row-p-name'
        name.innerText = 'Nazwa: ' + room.name;
        container.append(name)

        let leader = document.createElement('p');
        leader.className = 'row-p-leader'
        leader.innerText = 'Lider: ' + room.leader;
        container.append(leader)

        let users = document.createElement('p');
        users.className = 'row-p-players'
        users.innerText = 'Gracze: ' + room.users.length + '/' + room.size;
        container.append(users)
        row.append(container);

        let joinButton = document.createElement('div')
        joinButton.className = 'join-button';
        joinButton.onclick = () => openJoinPrompt(room);
        let buttonText = document.createElement('p')
        buttonText.className = 'join-button-text';
        buttonText.innerText = 'Wejdź!'
        joinButton.append(buttonText)

        row.append(joinButton)

        lobbyList.append(row)
    }
}

async function onLogOut() {
    const obj = await Net.sendPostData('/logout', {});

    if (obj.response === 'success')
        window.location.href = '/'
}

async function changeAvatar(n) {
    const obj = await Net.sendPostData('/changeAvatar', {avatar: n});
    document.getElementById('avatar-' + obj.prev).style.filter = 'brightness(100%)';
    document.getElementById('avatar-' + obj.next).style.filter = 'brightness(70%)';
}

function getWinProc(won, overall) {
    if (overall > 0 && won < overall) {
        return Math.floor((won / overall) * 100) + '%';
    } else {
        return '0%';
    }
}

function openJoinPrompt(room) {
    let joinPrompt = document.getElementById('join-prompt');
    joinPrompt.style.visibility = 'visible';

    document.getElementById('button-prompt').onclick = async () => {
        let enteredPass = document.getElementById('password-input-prompt').value;
        if (enteredPass ===  room.password) {
            let temp = await Net.sendPostData('/isAvatarInRoom', {id: room.id})
            if (!temp.response) {
                window.location.href = '/room?id=' + room.id;
            } else {
                showPopup('Ten avatar jest już w lobby', 'error', 3000).then();
                joinPrompt.style.visibility = 'hidden';
            }
        } else {
            showPopup('Błędne hasło', 'error', 3000).then();
            joinPrompt.style.visibility = 'hidden';
        }
    }
}