document.getElementById('add-button').onclick = onAdd;
document.getElementById('log-out').onclick = onLogOut;
document.getElementById('avatar-0').onclick = () => changeAvatar(0);
document.getElementById('avatar-1').onclick = () => changeAvatar(1);
document.getElementById('avatar-2').onclick = () => changeAvatar(2);
document.getElementById('avatar-3').onclick = () => changeAvatar(3);

loadStats();

loadRooms();

function loadStats() {
    $.ajax({
        url: '/getUser',
        type: 'POST',
        data: {},
        success: function (data) {
            const obj = JSON.parse(data)


            document.getElementById('welcome-msg').innerText = 'Witaj ' + obj.nick;
            document.getElementById('games-played').innerText = 'Gry zagrane: ' + obj.gamesPlayed;
            document.getElementById('money-sum').innerText = 'Razem zebrano: ' + obj.moneySum;
            document.getElementById('bought-sum').innerText = 'Liczba zakupów: ' + obj.placesBoughtSum;
            document.getElementById('games-won').innerText = 'Gry wygrane: ' + obj.gamesWon;
            document.getElementById('avg-roll').innerText = 'Średnie losowanie: ' + obj.averageRoll;
            document.getElementById('avatar-' + obj.avatar).style.filter = 'brightness(70%)'
        }
    });
}

function loadRooms() {
    $.ajax({
        url: '/loadRooms',
        type: 'POST',
        data: {},
        success: function (data) {
            const obj = JSON.parse(data)
            renderRooms(obj.rooms)
        }
    });
}

function onAdd() {
    let name = document.getElementById('room-name-input');
    let password = document.getElementById('room-password-input');
    let size = document.getElementById('room-users-select');

    if (name.value !== '' && password.value !== '') {
        $.ajax({
            url: '/createRoom',
            type: 'POST',
            data: {name: name.value, password: password.value, size: size.value},
            success: function (data) {
                const obj = JSON.parse(data)
                if (obj.response === 'success') {
                    name.value = '';
                    password.value = '';
                    size.value = 2;
                    renderRooms(obj.rooms)
                } else if (obj.response === 'name exists') {
                    showPopup('Pokój z taką nazwą już istnieje', 'error', 5000);
                }
            }
        });
    } else {
        showPopup('Pola z nazwą i hasłem nie mogą być puste!', 'error', 5000);
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
        joinButton.onclick = () => {
            window.location.href = '/room';
        }
        let buttonText = document.createElement('p')
        buttonText.className = 'join-button-text';
        buttonText.innerText = 'Wejdź!'
        joinButton.append(buttonText)

        row.append(joinButton)

        lobbyList.append(row)
    }
}

function onLogOut() {
    $.ajax({
        url: '/logout',
        type: 'POST',
        data: "ok",
        success: function (data) {
            const obj = JSON.parse(data)
            if (obj.response === 'success') {
                window.location.href = '/'
            }
        }
    });
}

function changeAvatar(n) {
    $.ajax({
        url: '/changeAvatar',
        type: 'POST',
        data: {avatar: n},
        success: function (data) {
            const obj = JSON.parse(data)

            document.getElementById('avatar-' + obj.prev).style.filter = 'brightness(100%)';
            document.getElementById('avatar-' + obj.next).style.filter = 'brightness(70%)';
        }
    });
}