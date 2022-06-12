export class Ui {
    game;
    net;
    playerList;
    stepEngine;
    skinName = ["Hotdog", "RJ-45", "Kebab", "Rezystor", "Router", "Piwo"];

    constructor(game, net, playerList) {
        this.game = game;
        this.net = net;
        this.playerList = playerList;
        this.createCameraMenu();
        this.hamburgerMenu();
        this.genPlayersList();

        this.setAvatarImage();
    }

    setStepEngine(stepEngine) {
        this.stepEngine = stepEngine;
    }

    createCameraMenu() {

        document.getElementById("camButton").onclick = () => this.game.setBirdView()


        document.getElementById("camButton").onmousedown = () => this.setSliderFlag(true);
        document.getElementById("camButton").onmouseout = () => this.setSliderFlag(false);

        document.getElementById("up").onclick = () => this.game.setCam(0, 150, -200)
        document.getElementById("down").onclick = () => this.game.setCam(0, 150, 200)
        document.getElementById("left-top").onclick = () => this.game.setCam(-200, 150, -200)
        document.getElementById("left").onclick = () => this.game.setCam(-200, 150, 0)
        document.getElementById("left-down").onclick = () => this.game.setCam(-200, 150, 200)
        document.getElementById("right-top").onclick = () => this.game.setCam(200, 150, -200)
        document.getElementById("right").onclick = () => this.game.setCam(200, 150, 0)
        document.getElementById("right-down").onclick = () => this.game.setCam(200, 150, 200)

        document.getElementById("rot").oninput = () => {
            this.game.camHeight(document.getElementById("height").value);
            this.game.rotCam(document.getElementById("rot").value);
            this.game.flags.sliderFlag = true;
        }
        document.getElementById("height").oninput = () => {
            this.game.camHeight(document.getElementById("height").value);
            this.game.flags.sliderFlag = true;
        }

        document.getElementById("rot").onmouseup = () => () => this.setSliderFlag(false);
        document.getElementById("height").onmouseup = () => () => this.setSliderFlag(true);

        document.getElementById("block_info_escape").onclick = () => {
            this.game.flags.hamburgerFlag = false;
            document.getElementById("block_info").style.display = "none";
        }
        document.getElementById("throw").onclick = () => {
            document.getElementById("throw").style.display = "none";
            let a = this.getRandomInt(1, 7);
            let b = this.getRandomInt(1, 7);
            this.net.throwCubes(a, b).then()
        }
        document.getElementById("skiptura").onclick = () => {
            document.getElementById("skiptura").style.display = "none";
            this.net.nexttura();
        }
    }

    updateSliders = (y) => {
        document.getElementById("height").value = y;
    }

    hamburgerMenu = () => {
        document.getElementById("menu_button").onclick = () => {
            this.updateHamburgerMenu();
            this.switchMenu();
        }
        document.getElementById("menu-escape").onclick = () => {
            this.switchMenu();
        }
    }

    switchMenu = () => {
        if (!this.game.flags.hamburgerFlag) {
            document.getElementById("menu").style.display = "flex";
            this.game.flags.hamburgerFlag = true;
        } else {
            document.getElementById("menu").style.display = "none";
            this.game.flags.hamburgerFlag = false;
        }
    }

    updateBlockInfo = (id) => {
        let restricted_names = ["brak", "Dyrektor Piszkowski", "i tak to idzie na fajki", "Dragosz"];
        document.getElementById("block_name").innerText = this.game.fields[id].name;
        if (!restricted_names.includes(this.game.fields[id].owner)) {
            document.getElementById("block_owner").innerText = "Właściciel: " + this.skinName[this.playerList[this.game.fields[id].owner].skin];
        } else {
            document.getElementById("block_owner").innerText = "Właściciel: " + this.game.fields[id].owner;
        }
        document.getElementById("block_shops").innerText = "Sklepy: ";
        let house_count = { small: 0, big: 0 };
        this.game.fields[id].shops.forEach(element => {
            if (element == 1) { house_count.small++ }
            else if (element == 2) { house_count.big++ }
        });
        if (house_count.small > 0) { document.getElementById("block_shops").innerText += String(house_count.small) + "x automat" }
        if (house_count.big > 0) { document.getElementById("block_shops").innerText += ", " + String(house_count.big) + "x budka z kebabem" }
        switch (this.game.fields[id].action) {
            case "none":
                document.getElementById("block_action").innerText = "Odwiedzający nic nie płaci ani nie otrzymuje.";
                break;
            case "take":
                document.getElementById("block_action").innerText = "Odwiedzający płaci $" + this.game.fields[id].value;
                break;
            case "add":
                document.getElementById("block_action").innerText = "Odwiedzający otrzymuje $" + this.game.fields[id].value;
                break;
            case "card":
                document.getElementById("block_action").innerText = "Odwiedzający otrzymuje losową kartę szansy";
                break;
        }
    }

    updateHamburgerMenu = () => {
        let id = this.net.player_id;
        let eq = this.playerList[id].eq;
        if (eq.length > 0) {
            let table = document.getElementById("eq_table")
            table.innerHTML = '';
            eq.forEach(field => {
                let tr = document.createElement("tr")
                for (let x in [0, 1, 2, 3]) {
                    let td = document.createElement("td")
                    switch (x) {
                        case "0":
                            td.innerText = this.game.fields[field].name;
                            break;
                        case "1":
                            td.innerText = this.game.fields[field].shops;
                            break;
                        case "2":
                            td.innerText = this.game.fields[field].value;
                            break;
                        default:
                            td.id = "buildbtn";
                            td.innerText = "Buduj"
                            td.onclick = () => {
                                this.showBuildMenu(field);
                            }
                            break;
                    }
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            });
        }
    }

    updateThrowbutton(last, current, tura) {
        if (last == current) {
            document.getElementById("throw").style.display = "none";
            if (current == tura) {
                if (!this.net.cubesInMove) {
                    document.getElementById("skiptura").style.display = "flex";
                }
            }
        }
        if (current != tura) {
            document.getElementById("skiptura").style.display = "none";
        }
    }
    updateEnemyList(playerList, player_id) {
        playerList.forEach(element => {
            if (element.id != player_id) {
                document.getElementById(element.nick + "_cashbox").innerText = String(element.cash) + "$";
                if (element.dead == true) {
                    document.getElementById(element.skin + "-avatar").src = "./avatars/dead.jpg";
                }
            }
        });
    }

    toggleThrowbutton(tura, id) {
        if (tura === id) {
            document.getElementById("throw").style.display = "flex"
        } else {
            document.getElementById("throw").style.display = "none";
        }
    }

    showInfoBox = (id) => {
        this.updateBlockInfo(id);
        let target = document.getElementById("block_info");
        target.style.display = "flex";
    }

    showBuyMenu = (index) => {
        document.getElementById("buymenu").style.display = "flex";
        document.getElementById("buyname").innerText = this.game.fields[index].name;
        document.getElementById("buyprice").innerText = "za " + this.game.fields[index].price + "$?";
    }

    showBuildMenu = (index) => {
        if (this.net.tura == this.net.player_id) {
            document.getElementById("buildmenu").style.display = "flex";
            document.getElementById("buildname").innerText = this.game.fields[index].name;
            document.getElementById("build").innerText = "TAK"
            if (this.game.fields[index].shops.length < 2) {
                document.getElementById("buildprice").innerText = "za " + (this.game.fields[index].price * 1.5) + "$?";
                document.getElementById("build").onclick = () => {
                    this.hideBuildMenu();
                    this.stepEngine.build(index, 1, this.net.player_id).then();
                }
            } else if (this.game.fields[index].shops.length === 2) {
                document.getElementById("buildprice").innerText = "za " + (this.game.fields[index].price * 3) + "$?";
                document.getElementById("build").onclick = () => {
                    this.hideBuildMenu();
                    this.stepEngine.build(index, 2, this.net.player_id).then();
                }
            } else {
                document.getElementById("build").innerText = "NIE"
                document.getElementById("build").onclick = () => {
                    this.hideBuildMenu();
                    this.net.nexttura().then();
                }
            }
            document.getElementById("dontbuild").onclick = () => {
                this.hideBuildMenu();
            }
        }
    }

    hideBuyMenu = () => {
        document.getElementById("buymenu").style.display = "none";
    }
    hideBuildMenu = () => {
        document.getElementById("buildmenu").style.display = "none";
    }

    updateCash = (player_id) => {
        document.getElementById("hud").innerText = "Kredyty: " + this.playerList[player_id].cash + "$"
    }

    buyButtonStatus = (x) => {
        document.getElementById("buy").disabled = x;
        if (x) {
            document.getElementById("buy").innerText = "Brak pieniędzy"
        } else {
            document.getElementById("buy").innerText = "TAK"
        }
    }

    genPlayersList = () => {
        let heightMultiplier = 0;
        this.playerList.forEach(element => {
            if (element.id !== this.game.myId) {
                let container = document.createElement('div');
                container.className = 'container-box';

                let nick = document.createElement('p');
                nick.className = "nick-box";
                nick.innerText = element.nick;

                let money = document.createElement('p');
                money.className = "money-box";
                money.id = element.nick + "_cashbox";
                money.innerText = element.cash + "$";

                let img = document.createElement("img");
                img.id = element.skin + "-avatar";
                img.className = "avatar-box";
                img.src = "./avatars/avatar-" + element.skin + ".jpg";

                container.append(nick, money, img)
                document.getElementById("playersList").appendChild(container)
                heightMultiplier++;
            }
        });
        document.getElementById("playersList").style.height = (75 * heightMultiplier) + "px";
    }

    getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    setAvatarImage() {
        document.getElementById('avatar-image').src = './avatars/avatar-' + this.playerList[this.game.myId].skin + '.jpg';
    }

    setSliderFlag(flag) {
        this.game.flags.sliderFlag = flag;
    }
}