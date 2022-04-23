document.getElementById('add-button').onclick = onAdd;

loadStats();

loadRooms();

function loadStats() {
    $.ajax({
        url: '/getUser',
        type: 'POST',
        data: {},
        success: function (data) {
            const obj = JSON.parse(data)
            console.log(obj)

            document.getElementById('welcome-msg').innerText = 'Witaj ' + obj.nick;
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
            console.log(obj)
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
                console.log(obj)
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

        let name = document.createElement('p');
        name.className = 'row-p'
        name.innerText = 'Nazwa: ' + room.name;
        row.append(name)

        let leader = document.createElement('p');
        leader.className = 'row-p'
        leader.style.top = '-12px'
        leader.style.left = '250px'
        leader.innerText = 'Lider: ' + room.leader;
        row.append(leader)

        let users = document.createElement('p');
        users.className = 'row-p'
        users.style.top = '-42px'
        users.style.left = '400px'
        users.innerText = 'Gracze: ' + room.users.length + '/' + room.size;
        row.append(users)

        let joinButton = document.createElement('div')
        joinButton.className = 'join-button';
        let buttonText = document.createElement('p')
        buttonText.className = 'join-button-text';
        buttonText.innerText = 'Wejdź!'
        joinButton.append(buttonText)

        row.append(joinButton)

        lobbyList.append(row)
    }
}