var game = 0;
var ui = 0;
var net = 0;
var players = 0;
var lastAction = "";

var playerlist = [
    { id: 0, position: 1, skin: "hotdog", nick: "", eq: [], cash: 1500 },
    { id: 1, position: 1, skin: "rj45", nick: "", eq: [], cash: 1500 },
    { id: 2, position: 1, skin: "kebab", nick: "", eq: [], cash: 1500 },
    { id: 3, position: 1, skin: "rezystor", nick: "", eq: [], cash: 1500 },
    { id: 4, position: -1, skin: "null", nick: "", eq: [], cash: 1500 },
    { id: 5, position: -1, skin: "null", nick: "", eq: [], cash: 1500 }
]
var playerAppearance = [
    { offset: { x: 5, z: -5 }, color: 0xffff20, emissive: 0x303010, scale: 2, height: 16, rotation: { x: 0, y: 90, z: 0 } },
    { offset: { x: 5, z: 5 }, color: 0x404040, emissive: 0xa1a1a1, scale: 0.5, height: 10, rotation: { x: 0, y: 90, z: 0 } },
    { offset: { x: 5, z: 15 }, color: 0xa85932, emissive: 0x753d3d, scale: 0.25, height: 10, rotation: { x: 110, y: 0, z: 0 } },
    { offset: { x: -5, z: -5 }, color: 0xa2a3a3, emissive: 0x666666, scale: 2, height: 25, rotation: { x: 90, y: 0, z: 0 } },
    { offset: { x: -5, z: 5 }, color: 0xffff20, emissive: 0x303010, scale: 1, height: 10, rotation: { x: 0, y: 90, z: 0 } },
    { offset: { x: -5, z: 15 }, color: 0xffff20, emissive: 0x303010, scale: 1, height: 10, rotation: { x: 0, y: 90, z: 0 } }
]

var in_move = [];
var cubes_in_move = false;

window.onload = () => {
    game = new Game();
    ui = new Ui();
    net = new Net();
    game.resize(window.innerWidth, window.innerHeight);
}
window.onresize = () => {
    game.resize(window.innerWidth, window.innerHeight);
}
