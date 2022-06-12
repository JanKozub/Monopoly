import { GameNet } from "../GameNet.js";

export class StepEngine {
    ui;
    gameNet;
    playerList;
    fields;

    constructor(ui, net, playerList, fields) {
        this.ui = ui;
        this.gameNet = net;
        this.playerList = playerList;
        this.fields = fields;
    }
    update(fields) {
        this.fields = fields;
    }
    step(player_id, tura, index) {
        if (player_id === tura) {
            if (this.fields[index].action === "none" && this.fields[index].owner === "brak" && this.fields[index].price != 0) { //pole kupowalne
                this.ui.showBuyMenu(index);
                this.ui.buyButtonStatus(this.playerList[player_id].cash < this.fields[index].price); //włącza / wyłącza przycisk TAK jeśli nie ma cash

                document.getElementById("dontbuy").onclick = () => {  //KLIK NA NIE
                    this.ui.hideBuyMenu();
                    this.gameNet.nextTura();
                }
                document.getElementById("buy").onclick = () => { //KLIK NA TAK
                    this.buy(index, player_id).then(); //zakup pola przez gracza
                    this.ui.hideBuyMenu();
                }
            } else { //pola zajęte lub niekupowalne
                switch (this.fields[index].action) {
                    case "take":
                        if (this.fields[index].owner !== player_id) {
                            this.take(index, player_id).then(); //pobranie z konta za postój lub karę
                        }
                        break;
                    case "card":
                        this.card(player_id).then(); //losowanie przez serwer karty dla gracza
                        break;
                    case "add":
                        this.add(player_id, this.fields[index].value).then(); //dodaje graczowi o id (player_id) liczbę $
                        break;
                    case "prison":
                        this.prison(player_id).then(); //wstrzymuje kolejkę dla (player_id)
                        break;
                }
            }

        }
    }

    async buy(fieldIdx, player_id) {  //Pobiera id pola kupowanego i id gracza kupującego
        let data = JSON.stringify({
            action: "buy",
            fieldIdx: fieldIdx,
            player_id: player_id
        })
        this.gameNet.nextTura();
        await GameNet.sendFetch(data, "/action")
    }

    async take(fieldIdx, player_id) {  //Pobiera graczowi (player_id) wartość value pola (fieldIdx)
        let data = JSON.stringify({
            action: "take",
            fieldIdx: fieldIdx,
            player_id: player_id
        })
        await GameNet.sendFetch(data, "/action")
    }

    async build(index, typ, player_id) {
        let data = JSON.stringify({
            action: "build",
            fieldIdx: index,
            type: typ,
            player_id: player_id,
        })
        this.gameNet.nextTura();
        await GameNet.sendFetch(data, "/action")
    }

    async card(player_id) {  //Losuje dla gracza treść karty i zwraca text,action,value
        let data = JSON.stringify({
            action: "card",
            player_id: player_id
        })
        this.gameNet.nextTura();
        await GameNet.sendFetch(data, "/action")
        //wykonaj akcję dla CARD
    }

    async add(player_id, value) {  //dodaje graczowi o danym id, daną ilość $
        let data = JSON.stringify({
            action: "add",
            player_id: player_id,
            value: value
        })
        await GameNet.sendFetch(data, "/action")
        //wykonaj akcję dla CARD
    }
    async prison(player_id) {  //zamyka gracza w więzieniu
        let data = JSON.stringify({
            action: "prison",
            player_id: player_id,
        })
        this.gameNet.nextTura();
        await GameNet.sendFetch(data, "/action")
        //wykonaj akcję dla PRISON
    }

}