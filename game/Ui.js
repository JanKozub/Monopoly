export class Ui {
    game;
    net;
    playerList;
    stepEngine;

    constructor(game, net, playerList) {
        this.game = game;
        this.net = net;
        this.playerList = playerList;
        this.createCameraMenu();
        this.hamburgerMenu();
        this.genAvatarlist();

        this.setAvatarImage();
    }
    setStepEngine(stepEngine) {
        this.stepEngine = stepEngine;
    }
    createCameraMenu = () => {

        document.getElementById("cambutton").onclick = () => {
            this.game.setBirdView()
        }
        document.getElementById("cambutton").onmousedown = () => {
            this.game.flags.sliderFlag = true;
        }
        document.getElementById("cambutton").onmouseout = () => {
            this.game.flags.sliderFlag = false;
        }

        document.getElementById("up").onclick = () => {
            this.game.setCam(0, 150, -200)
        }
        document.getElementById("down").onclick = () => {
            this.game.setCam(0, 150, 200)
        }
        document.getElementById("left-top").onclick = () => {
            this.game.setCam(-200, 150, -200)
        }
        document.getElementById("left").onclick = () => {
            this.game.setCam(-200, 150, 0)
        }
        document.getElementById("left-down").onclick = () => {
            this.game.setCam(-200, 150, 200)
        }
        document.getElementById("right-top").onclick = () => {
            this.game.setCam(200, 150, -200)
        }
        document.getElementById("right").onclick = () => {
            this.game.setCam(200, 150, 0)
        }
        document.getElementById("right-down").onclick = () => {
            this.game.setCam(200, 150, 200)
        }
        document.getElementById("rot").oninput = () => {
            this.game.camHeight(document.getElementById("height").value);
            this.game.rotCam(document.getElementById("rot").value);
            this.game.flags.sliderFlag = true;
        }
        document.getElementById("height").oninput = () => {
            this.game.camHeight(document.getElementById("height").value);
            this.game.flags.sliderFlag = true;
        }
        document.getElementById("rot").onmouseup = () => {
            this.game.flags.sliderFlag = false;
        }
        document.getElementById("height").onmouseup = () => {
            this.game.flags.sliderFlag = false;
        }
        document.getElementById("block_info_escape").onclick = () => {
            this.game.flags.hamburgerFlag = false;
            document.getElementById("block_info").style.display = "none";
        }
        document.getElementById("throw").onclick = () => {
            document.getElementById("throw").style.display = "none";
            let a = this.getRandomInt(1, 7);
            let b = this.getRandomInt(1, 7);
            this.net.throwCubes(a, b)
        }
    }

    updateSliders = (x, y, z) => {
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
            document.getElementById("block_owner").innerText = "Właściciel: " + this.playerList[this.game.fields[id].owner].skin;
        } else {
            document.getElementById("block_owner").innerText = "Właściciel: " + this.game.fields[id].owner;
        }
        document.getElementById("block_shops").innerText = "Sklepy: ";
        this.game.fields[id].shops.forEach(element => {
            document.getElementById("block_shops").innerText += element.name + ", "
        });
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

    showBuymenu = (index, id) => {
        document.getElementById("buymenu").style.display = "flex";
        document.getElementById("buyname").innerText = this.game.fields[index].name;
        document.getElementById("buyprice").innerText = "za " + String(this.game.fields[index].price) + "$?";
    }

    showBuildMenu = (index) => {
        document.getElementById("buildmenu").style.display = "flex";
        document.getElementById("buildname").innerText = this.game.fields[index].name;
        document.getElementById("build").innerText = "TAK"
        if (this.game.fields[index].shops.length < 2) {
            document.getElementById("buildprice").innerText = "za " + String(this.game.fields[index].price * 1.5) + "$?";
            document.getElementById("build").onclick = () => {
                this.hideBuildmenu();
                this.stepEngine.build(index, 1, this.net.player_id);
            }
        } else if (this.game.fields[index].shops.length == 2) {
            document.getElementById("buildprice").innerText = "za " + String(this.game.fields[index].price * 3) + "$?";
            document.getElementById("build").onclick = () => {
                this.hideBuildmenu();
                this.stepEngine.build(index, 2, this.net.player_id);
            }
        } else {
            document.getElementById("build").innerText = "NIE"
            document.getElementById("build").onclick = () => {
                this.hideBuildmenu();
                this.net.nexttura();
            }
        }

    }

    hideBuymenu = () => {
        document.getElementById("buymenu").style.display = "none";
    }
    hideBuildmenu = () => {
        document.getElementById("buildmenu").style.display = "none";
    }


    updateCash = (player_id) => {
        document.getElementById("hud").innerText = "Kredyty: " + this.playerList[player_id].cash + "$"
    }


    buybuttonStatus = (x) => {
        document.getElementById("buy").disabled = x;
        if (x) {
            document.getElementById("buy").innerText = "Brak pieniędzy"
        } else {
            document.getElementById("buy").innerText = "TAK"
        }
    }

    genAvatarlist = () => {
        let heightMultiplier = 0;
        this.playerList.forEach(element => {
            if (element.id !== this.game.myId) {
                heightMultiplier++;
                let img = document.createElement("img");
                img.id = element.skin + "-avatar";
                img.className = "avatar-box";
                img.src = "./avatars/avatar-" + element.skin + ".jpg";
                document.getElementById("avatarlist").appendChild(img)
            }
        });
        document.getElementById("avatarlist").style.height = (75 * heightMultiplier) + "px";
    }

    getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    setAvatarImage() {
        document.getElementById('avatar-image').src = './avatars/avatar-' + this.game.myId + '.jpg';
    }
}