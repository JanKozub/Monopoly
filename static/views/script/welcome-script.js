document.getElementById('login-button').onclick = () => onClick('login');
document.getElementById('register-button').onclick = () => onClick('register');

document.getElementById('nick').select();

window.onkeydown = (k) => {
    if (k.key === 'Enter') {
        onClick('login');
    }
}

function onClick(url) {
    let nick = document.getElementById('nick')
    let password = document.getElementById('passwd')
    if (nick.value !== '') {
        if (password.value !== '') {
            $.ajax({
                url: url,
                type: 'POST',
                data: {nick: nick.value, password: password.value},
                success: function (data) {
                    console.log(data)
                    const obj = JSON.parse(data);
                    if (obj.response === 'user exists') {
                        showPopup('Ten nick jest już zajęty', 'inform', 3000);
                    } else if (obj.response === 'user does not exist') {
                        showPopup('Użytownik nie istnieje!', 'error', 3000);
                    } else if (obj.response === 'wrong password') {
                        showPopup('Błędne hasło!', 'error', 3000);
                    } else {
                        window.location.href = '/rooms';
                    }
                }
            });
        } else {
            password.select();
            showPopup('Wpisz Nick!', 'error', 3000);
        }
    } else {
        nick.select();
        showPopup('Wpisz Nick!', 'error', 3000);
    }
}