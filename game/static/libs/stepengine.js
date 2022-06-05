stepengine = (player_id, tura, index, id) => {
    if (player_id === tura) {
        if (fields[index].action === "none") { //pole kupowalne

            ui.showBuymenu(index, id);
            ui.buybuttonStatus(playerlist[player_id].cash < fields[index].price); //włącza / wyłącza przycisk TAK jeśli nie ma cash

            document.getElementById("dontbuy").onclick = () => {  //KLIK NA NIE
                ui.hideBuymenu();
                net.stopTuraCounter();
            }
            document.getElementById("buy").onclick = () => { //KLIK NA TAK
                buy(index, player_id); //zakup pola przez gracza
                net.stopTuraCounter();
                ui.hideBuymenu();

            }
        } else { //pola zajęte lub niekupowalne
            switch (fields[index].action) {
                case "take":
                    if (fields[index].owner !== player_id) {
                        take(index, player_id); //pobranie z konta za postój lub karę
                    }
                    break;
                case "card":
                    card(player_id); //losowanie przez serwer karty dla gracza
                    break;
                case "add":
                    add(player_id, fields[index].value); //dodaje graczowi o id (player_id) liczbę $
                    break;
            }
        }

    }
}

buy = async (fieldIdx, player_id) => {  //Pobiera id pola kupowanego i id gracza kupującego
    let data = JSON.stringify({
        action: "buy",
        fieldIdx: fieldIdx,
        player_id: player_id
    })
    let reply = await sendFetch(data, "/action")
}

take = async (fieldIdx, player_id) => {  //Pobiera graczowi (player_id) wartość value pola (fieldIdx)
    let data = JSON.stringify({
        action: "take",
        fieldIdx: fieldIdx,
        player_id: player_id
    })
    let reply = await sendFetch(data, "/action")
}

card = async (player_id) => {  //Losuje dla gracza treść karty i zwraca text,action,value
    let data = JSON.stringify({
        action: "card",
        player_id: player_id
    })
    let reply = await sendFetch(data, "/action")
    //wykonaj akcję dla CARD
}

add = async (player_id, value) => {  //dodaje graczowi o danym id, daną ilość $
    let data = JSON.stringify({
        action: "add",
        player_id: player_id,
        value: value
    })
    let reply = await sendFetch(data, "/action")
    //wykonaj akcję dla CARD
}