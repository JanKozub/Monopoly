let blocker = false;

function showPopup(msg, type, time) {
    return new Promise((resolve) => {
        if (!blocker) {
            blocker = true;
            let popupEl = document.getElementById('popup');

            document.getElementById('popup-text').innerText = 'Wiadomość:\n' + msg;

            if (type === 'success') {
                popupEl.style.backgroundColor = 'rgba(66,255,69,0.8)'
            } else if (type === 'inform') {
                popupEl.style.backgroundColor = 'rgba(66,120,255,0.8)'
            } else if (type === 'error') {
                popupEl.style.backgroundColor = 'rgba(255, 66, 66, 0.8)'
            }

            try {
                popupEl.classList.remove('hide');
            } catch (e) {

            }

            popupEl.classList.add('show');
            console.log('popup shown')

            setTimeout(() => {
                popupEl.classList.remove('show');
                popupEl.classList.add('hide');
                blocker = false;
                resolve(true)
            }, time)
        }
    });
}