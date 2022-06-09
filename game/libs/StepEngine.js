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

    step(player_id, tura, index, id) {
        if (player_id === tura) {
            if (this.fields[index].action === "none" && this.fields[index].owner === "brak") { //pole kupowalne

                this.ui.showBuymenu(index, id);
                this.ui.buybuttonStatus(this.playerList[player_id].cash < this.fields[index].price); //włącza / wyłącza przycisk TAK jeśli nie ma cash

                document.getElementById("dontbuy").onclick = () => {  //KLIK NA NIE
                    this.ui.hideBuymenu();
                    this.gameNet.stopTuraCounter();
                }
                document.getElementById("buy").onclick = () => { //KLIK NA TAK
                    this.buy(index, player_id).then(); //zakup pola przez gracza
                    this.gameNet.stopTuraCounter();
                    this.ui.hideBuymenu();

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
        this.gameNet.nexttura();
        await GameNet.sendFetch(data, "/action")
    }

    async card(player_id) {  //Losuje dla gracza treść karty i zwraca text,action,value
        let data = JSON.stringify({
            action: "card",
            player_id: player_id
        })
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

}