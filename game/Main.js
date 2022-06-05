import {GameNet} from "./GameNet.js";
import {Game} from "./Game.js";
import {Ui} from "./Ui.js";
import {Animations} from "./libs/Animations.js";

let game;
let ui;
let net;

let playerList = [
    {id: 0, position: 1, skin: "hotdog", nick: "", eq: [], cash: 1500},
    {id: 1, position: 1, skin: "rj45", nick: "", eq: [], cash: 1500},
    {id: 2, position: 1, skin: "kebab", nick: "", eq: [], cash: 1500},
    {id: 3, position: 1, skin: "rezystor", nick: "", eq: [], cash: 1500},
    {id: 4, position: -1, skin: "null", nick: "", eq: [], cash: 1500},
    {id: 5, position: -1, skin: "null", nick: "", eq: [], cash: 1500}
]

let playerAppearance = [
    {offset: {x: 5, z: -5}, color: 0xffff20, emissive: 0x303010, scale: 2, height: 16, rotation: {x: 0, y: 90, z: 0}},
    {offset: {x: 5, z: 5}, color: 0x404040, emissive: 0xa1a1a1, scale: 0.5, height: 10, rotation: {x: 0, y: 90, z: 0}},
    {offset: {x: 5, z: 15}, color: 0xa85932, emissive: 0x753d3d, scale: 0.25, height: 10, rotation: {x: 110, y: 0, z: 0}},
    {offset: {x: -5, z: -5}, color: 0xa2a3a3, emissive: 0x666666, scale: 2, height: 25, rotation: {x: 90, y: 0, z: 0}},
    {offset: {x: -5, z: 5}, color: 0xffff20, emissive: 0x303010, scale: 1, height: 10, rotation: {x: 0, y: 90, z: 0}},
    {offset: {x: -5, z: 15}, color: 0xffff20, emissive: 0x303010, scale: 1, height: 10, rotation: {x: 0, y: 90, z: 0}}
]

let fields = [
    { id: 0, name: "Start", owner: "brak", shops: [], price: 0, action: "add", value: 200 },
    { id: 1, name: "POLE", owner: "brak", shops: [{ name: "budka z kebabem" }, { name: "automat" }], price: 60, action: "none", value: 0 },
    { id: 2, name: "POLE", owner: "brak", shops: [], price: 0, action: "add", value: 100 },
    { id: 3, name: "POLE", owner: "brak", shops: [], price: 60, action: "none", value: 0 },
    { id: 4, name: "Budżet dla samorządu", owner: "brak", shops: [], price: 0, action: "take", value: 200 },
    { id: 5, name: "Toaleta na pracowniach", owner: "brak", shops: [], price: 200, action: "none", value: 0 },
    { id: 6, name: "POLE", owner: "brak", shops: [], price: 100, action: "none", value: 0 },
    { id: 7, name: "Szansa", owner: "brak", shops: [], price: 0, action: "card", value: 0 },
    { id: 8, name: "POLE", owner: "brak", shops: [], price: 100, action: "none", value: 0 },
    { id: 9, name: "POLE", owner: "brak", shops: [], price: 120, action: "none", value: 0 },
    { id: 10, name: "Spacerniak ZSŁ. Dla odwiedzających.", owner: "brak", shops: [], price: 0, action: "add", value: 200 },
    { id: 11, name: "POLE", owner: "brak", shops: [], price: 140, action: "none", value: 0 },
    { id: 12, name: "POLE", owner: "brak", shops: [], price: 150, action: "none", value: 0 },
    { id: 13, name: "POLE", owner: "brak", shops: [], price: 140, action: "none", value: 0 },
    { id: 14, name: "POLE", owner: "brak", shops: [], price: 160, action: "none", value: 0 },
    { id: 15, name: "POLE", owner: "brak", shops: [], price: 200, action: "none", value: 0 },
    { id: 16, name: "POLE", owner: "brak", shops: [], price: 180, action: "none", value: 0 },
    { id: 17, name: "POLE", owner: "brak", shops: [], price: 0, action: "none", value: 0 },
    { id: 18, name: "POLE", owner: "brak", shops: [], price: 180, action: "none", value: 0 },
    { id: 19, name: "POLE", owner: "brak", shops: [], price: 200, action: "none", value: 0 },
    { id: 20, name: "Parking przy Domu Pomocy.", owner: "brak", shops: [], price: 0, action: "none", value: 0 },
    { id: 21, name: "POLE", owner: "brak", shops: [], price: 220, action: "none", value: 0 },
    { id: 22, name: "POLE", owner: "brak", shops: [], price: 0, action: "card", value: 0 },
    { id: 23, name: "POLE", owner: "brak", shops: [], price: 220, action: "none", value: 0 },
    { id: 24, name: "POLE", owner: "brak", shops: [], price: 240, action: "none", value: 0 },
    { id: 25, name: "POLE", owner: "brak", shops: [], price: 200, action: "none", value: 0 },
    { id: 26, name: "POLE", owner: "brak", shops: [], price: 260, action: "none", value: 0 },
    { id: 27, name: "POLE", owner: "brak", shops: [], price: 260, action: "none", value: 0 },
    { id: 28, name: "POLE", owner: "brak", shops: [], price: 150, action: "none", value: 0 },
    { id: 29, name: "POLE", owner: "brak", shops: [], price: 280, action: "none", value: 0 },
    { id: 30, name: "Idziesz grabić liście!", owner: "brak", shops: [], price: 0, action: "none", value: 0 },
    { id: 31, name: "POLE", owner: "brak", shops: [], price: 300, action: "none", value: 0 },
    { id: 32, name: "POLE", owner: "brak", shops: [], price: 300, action: "none", value: 0 },
    { id: 33, name: "POLE", owner: "brak", shops: [], price: 0, action: "none", value: 0 },
    { id: 34, name: "POLE", owner: "brak", shops: [], price: 320, action: "none", value: 0 },
    { id: 35, name: "POLE", owner: "brak", shops: [], price: 200, action: "none", value: 0 },
    { id: 36, name: "POLE", owner: "brak", shops: [], price: 0, action: "card", value: 0 },
    { id: 37, name: "POLE", owner: "brak", shops: [], price: 350, action: "none", value: 0 },
    { id: 38, name: "POLE", owner: "brak", shops: [], price: 0, action: "take", value: 100 },
    { id: 39, name: "POLE", owner: "brak", shops: [], price: 400, action: "none", value: 0 },
]

window.onload = () => {
    game = new Game(playerList, playerAppearance, fields);
    let animations = new Animations(playerList, playerAppearance, game);
    net = new GameNet(game, playerList, animations);
    ui = new Ui(game, net, playerList);

    game.setUi(ui);
    net.setUi(ui);
    game.resize(window.innerWidth, window.innerHeight);
}
window.onresize = () => {
    game.resize(window.innerWidth, window.innerHeight);
}
