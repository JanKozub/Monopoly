import { Players } from "./components/players/Players.js";
import { RayCaster } from "./components/Raycaster.js";
import { Flags } from "./libs/Flags.js";
import { Board } from "./components/Board.js";
import { Light, ShadowPlane } from "./libs/Shadow.js";
import { Buttons } from "./components/buttons/Buttons.js";
import { Cubes } from "./components/cubes/Cubes.js";
import { Houses } from "./components/houses/Houses.js";

import { Animations } from "./libs/Animations.js";

export class Game {
    cameraTar = { x: 0, y: 220, z: 0 }
    ui = undefined;
    flags = new Flags();
    fields;
    players;

    constructor(playerList, playerAppearance) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);
        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setClearColor(0xffffff);
        this.renderer.setSize(1200, 800);

        //LIGHT
        this.light = new Light();
        this.scene.add(this.light.getLight())

        //PLANE TO DISPLAY SHADOWS
        this.shadowplane = new ShadowPlane();
        this.scene.add(this.shadowplane.getPlane());

        this.axesHelper = new THREE.AxesHelper(1000);
        this.scene.add(this.axesHelper);

        this.scene.add(this.light.getHelper())

        document.getElementById("root").append(this.renderer.domElement);

        this.camera.position.set(0, 220, 0)

        this.camera.lookAt(this.scene.position);

        //BOARD
        this.board = new Board();
        this.scene.add(this.board);

        //BUTTONS
        this.buttons = new Buttons();
        this.scene.add(this.buttons);

        //CUBES
        this.cubes = new Cubes(20);
        this.scene.add(this.cubes);

        //HOUSES
        this.houses = new Houses(this.buttons);
        this.scene.add(this.houses);

        this.highlight();

        //PLAYERS
        this.players = new Players(playerList, playerAppearance);
        this.scene.add(this.players)

        this.render()
        this.scene.add(this.camera)

        // Shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Gamma
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        // Fog
        this.scene.fog = new THREE.Fog(0x23272a, 0.5, 1600, 4000);


        //MOUSEOVER FLAG
        this.mouseOnBoard = false;
    }

    setUi(ui) {
        this.ui = ui;
    }

    setFields(fields) {
        this.fields = fields;
    }

    resize = function (Width, Height) {
        this.camera.aspect = Width / Height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(Width, Height);
    }

    highlight = () => {
        window.onmousemove = (event) => {
            const intersects = RayCaster.cameraCaster(event, this.buttons.children, this.camera, this.flags);

            if (intersects.length > 0) {
                this.mouseOnBoard = true;
                this.buttons.hide()
                intersects[0].object.material.opacity = 0.3;

                //click NA POLE!!!
                window.onclick = () => {
                    if (this.mouseOnBoard) {
                        let id = intersects[0].object.fieldID;
                        this.flags.hamburgerFlag = true;
                        this.ui.showInfoBox(id);
                    }
                }

                //mousedown/up highlight
                window.onmousedown = () => {
                    intersects[0].object.material.color.set("grey");
                }
                window.onmouseup = () => {
                    intersects[0].object.material.color.set("white");
                }

            } else {
                this.mouseOnBoard = false;
                this.buttons.hide()
            }
        }
    }
    setCam = (x, y, z) => {
        this.cameraTar = { x: x, y: y, z: z }

        this.ui.updateSliders(this.camera.position.x, this.camera.position.y, this.camera.position.z)
    }
    setBirdView = () => {
        this.camera.position.set(0, 220, 0);
        this.camera.lookAt(this.scene.position);
        this.cameraTar = { x: 0, y: 220, z: 0 }
        this.ui.updateSliders(0, 220, 0)
    }
    rotCam = (deg) => {
        let rad = deg * (Math.PI / 180)
        this.camera.position.z = Math.cos(rad) * 220
        this.camera.position.x = Math.sin(rad) * 220
        this.camera.lookAt(this.scene.position);

        this.cameraTar.x = Math.sin(rad) * 220
        this.cameraTar.z = Math.cos(rad) * 220
    }
    camHeight = (val) => {
        this.camera.position.y = val;
        this.camera.lookAt(this.scene.position);

        this.cameraTar.y = val
    }

    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.render(this.scene, this.camera);
        TWEEN.update();

        // //Animations
        if (!this.flags.sliderFlag) {
            if (this.cameraTar.x > this.camera.position.x) {
                this.camera.position.x += 5
            }
            if (this.cameraTar.x < this.camera.position.x) {
                this.camera.position.x -= 5
            }

            if (this.cameraTar.y > this.camera.position.y) {
                this.camera.position.y += 5
            }
            if (this.cameraTar.y < this.camera.position.y) {
                this.camera.position.y -= 5
            }

            if (this.cameraTar.z > this.camera.position.z) {
                this.camera.position.z += 5
            }
            if (this.cameraTar.z < this.camera.position.z) {
                this.camera.position.z -= 5
            }
            this.camera.lookAt(this.scene.position);
        }
    }


}
