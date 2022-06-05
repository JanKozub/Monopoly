class Ui {
    constructor() {
        this.createCameraMenu();
        this.hamburgerMenu();
    }
    createCameraMenu = () => {

        document.getElementById("cambutton").onclick = () => {
            game.setBirdView()
        }
        document.getElementById("cambutton").onmousedown = () => {
            sliderFlag = true;
        }
        document.getElementById("cambutton").onmouseout = () => {
            sliderFlag = false;
        }

        document.getElementById("up").onclick = () => {
            game.setCam(0, 150, -200)
        }
        document.getElementById("down").onclick = () => {
            game.setCam(0, 150, 200)
        }
        document.getElementById("left-top").onclick = () => {
            game.setCam(-200, 150, -200)
        }
        document.getElementById("left").onclick = () => {
            game.setCam(-200, 150, 0)
        }
        document.getElementById("left-down").onclick = () => {
            game.setCam(-200, 150, 200)
        }
        document.getElementById("right-top").onclick = () => {
            game.setCam(200, 150, -200)
        }
        document.getElementById("right").onclick = () => {
            game.setCam(200, 150, 0)
        }
        document.getElementById("right-down").onclick = () => {
            game.setCam(200, 150, 200)
        }
        document.getElementById("rot").oninput = () => {
            game.camHeight(document.getElementById("height").value);
            game.rotCam(document.getElementById("rot").value);
            sliderFlag = true;
        }
        document.getElementById("height").oninput = () => {
            game.camHeight(document.getElementById("height").value);
            sliderFlag = true;
        }
        document.getElementById("rot").onmouseup = () => {
            sliderFlag = false;
        }
        document.getElementById("height").onmouseup = () => {
            sliderFlag = false;
        }
        document.getElementById("block_info_escape").onclick = () => {
            hamburgerFlag = false;
            document.getElementById("block_info").style.display = "none";
        }
        document.getElementById("throw").onclick = () => {
            document.getElementById("throw").style.display = "none";
            let a = this.getRandomInt(1, 7);
            let b = this.getRandomInt(1, 7);
            net.throwCubes(a, b)
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
        if (!hamburgerFlag) {
            document.getElementById("menu").style.display = "flex";
            hamburgerFlag_switch(true);
        } else {
            document.getElementById("menu").style.display = "none";
            hamburgerFlag_switch(false);
        }
    }
    updateBlockInfo = (id) => {
        document.getElementById("block_name").innerText = fields[id].name;
        if (fields[id].owner != "brak") { document.getElementById("block_owner").innerText = "Właściciel: " + playerlist[fields[id].owner].skin; }
        else { document.getElementById("block_owner").innerText = "Właściciel: " + fields[id].owner; }
        document.getElementById("block_shops").innerText = "Sklepy: ";
        fields[id].shops.forEach(element => {
            document.getElementById("block_shops").innerText += element.name + ", "
        });
        switch (fields[id].action) {
            case "none":
                document.getElementById("block_action").innerText = "Odwiedzający nic nie płaci ani nie otrzymuje.";
                break;
            case "take":
                document.getElementById("block_action").innerText = "Odwiedzający płaci $" + fields[id].value;
                break;
            case "add":
                document.getElementById("block_action").innerText = "Odwiedzający otrzymuje $" + fields[id].value;
                break;
            case "card":
                document.getElementById("block_action").innerText = "Odwiedzający otrzymuje losową kartę szansy";
                break;
        }
    }
    updateHamburgerMenu = () => {
        let id = net.player_id;
        let eq = playerlist[id].eq;
        if (eq.length > 0) {
            let table = document.getElementById("eq_table")
            table.innerHTML = '';
            eq.forEach(field => {
                let tr = document.createElement("tr")
                for (let x in [0, 1, 2]) {
                    let td = document.createElement("td")
                    switch (x) {
                        case "0": td.innerText = fields[field].name; break;
                        case "1": td.innerText = String(fields[field].shops); break;
                        case "2": td.innerText = String(fields[field].value); break;
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
        document.getElementById("buyname").innerText = fields[index].name;
        document.getElementById("buyprice").innerText = "za " + String(fields[index].price) + "$?";
    }
    hideBuymenu = () => {
        document.getElementById("buymenu").style.display = "none";
    }
    updateCash = (player_id) => {
        document.getElementById("hud").innerText = "Kredyty: " + String(playerlist[player_id].cash) + "$"
    }
    buybuttonStatus = (x) => {
        document.getElementById("buy").disabled = x;
        if (x) {
            document.getElementById("buy").innerText = "Brak pieniędzy"
        } else { document.getElementById("buy").innerText = "TAK" }
    }

    getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

}