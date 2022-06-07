import {GameNet} from "./GameNet.js";
import {Game} from "./Game.js";
import {Ui} from "./Ui.js";
import {Animations} from "./libs/Animations.js";
import {StepEngine} from "./libs/stepengine.js";

let game;
let ui;
let net;

let playerAppearance = [
    {offset: {x: 5, z: -5}, color: 0xffff20, emissive: 0x303010, scale: 2, height: 16, rotation: {x: 0, y: 90, z: 0}},
    {offset: {x: 5, z: 5}, color: 0x404040, emissive: 0xa1a1a1, scale: 0.5, height: 10, rotation: {x: 0, y: 90, z: 0}},
    {offset: {x: 5, z: 15}, color: 0xa85932, emissive: 0x753d3d, scale: 0.25, height: 10, rotation: {x: 110, y: 0, z: 0}},
    {offset: {x: -5, z: -5}, color: 0xa2a3a3, emissive: 0x666666, scale: 2, height: 25, rotation: {x: 90, y: 0, z: 0}},
    {offset: {x: -5, z: 5}, color: 0xffff20, emissive: 0x303010, scale: 1, height: 10, rotation: {x: 0, y: 90, z: 0}},
    {offset: {x: -5, z: 15}, color: 0xffff20, emissive: 0x303010, scale: 1, height: 10, rotation: {x: 0, y: 90, z: 0}}
]

let fields;

window.onload = async () => {
    let id = window.location.href.split('=')[1];
    let playerList = await GameNet.sendFetch(JSON.stringify({id: id}), "/init")

    game = new Game(playerList, playerAppearance, fields);
    let animations = new Animations(playerList, playerAppearance, game);
    net = new GameNet(game, playerList, animations);
    ui = new Ui(game, net, playerList);

    game.setUi(ui);
    net.setUi(ui);
    game.setFields(await net.getFields());
    net.setStepEngine(new StepEngine(ui, net, playerList, game.fields));
    game.resize(window.innerWidth, window.innerHeight);
}
window.onresize = () => {
    game.resize(window.innerWidth, window.innerHeight);
}
