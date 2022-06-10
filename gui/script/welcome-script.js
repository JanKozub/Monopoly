window.onload = () => {
    document.getElementById('login-button').onclick = () => onClick('login');
    document.getElementById('register-button').onclick = () => onClick('register');

    document.getElementById('nick').select();

    window.onkeydown = (k) => {
        if (k.key === 'Enter') {
            onClick('login');
        }
    }
}

async function onClick(url) {
    let nick = document.getElementById('nick')
    let password = document.getElementById('passwd')
    if (nick.value !== '') {
        if (password.value !== '') {
            const obj = await Net.sendPostData(url, {nick: nick.value, password: password.value});

            if (obj.response === 'user exists') {
                showPopup('Ten nick jest już zajęty', 'inform', 3000).then();
            } else if (obj.response === 'user does not exist') {
                showPopup('Użytownik nie istnieje!', 'error', 3000).then();
            } else if (obj.response === 'wrong password') {
                showPopup('Błędne hasło!', 'error', 3000).then();
            } else {
                window.location.href = '/rooms';
            }
        } else {
            password.select();
            showPopup('Wpisz Nick!', 'error', 3000).then();
        }
    } else {
        nick.select();
        showPopup('Wpisz Nick!', 'error', 3000).then();
    }
}