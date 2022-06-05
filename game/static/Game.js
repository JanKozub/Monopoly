let cameraTar = { x: 0, y: 220, z: 0 }

class Game {

    constructor() {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);
        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setClearColor(0xffffff);
        this.renderer.setSize(1200, 800);

        //LIGHT
        this.light = new Light()
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
        this.board = new Board;
        this.scene.add(this.board);

        //BUTTONS
        this.buttons = new Buttons;
        this.scene.add(this.buttons);

        //CUBES
        this.cubes = new Cubes(20);
        this.scene.add(this.cubes);

        this.highlight();

        //PLAYERS
        players = new Players();
        this.scene.add(players)

        this.render()
        this.scene.add(this.camera)

        this.x_down = false;
        this.x_up = false;

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

    resize = function (Width, Height) {
        this.camera.aspect = Width / Height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(Width, Height);
    }

    highlight = () => {
        window.onmousemove = (event) => {
            const intersects = cameraCaster(event, this.buttons.children, this.camera);

            if (intersects.length > 0) {
                this.mouseOnBoard = true;
                this.buttons.hide()
                document.getElementById("body").style.cursor = "pointer";
                intersects[0].object.material.opacity = 0.3;



                //click NA POLE!!!
                window.onclick = () => {
                    if (this.mouseOnBoard) {
                        console.log(intersects[0].object.fieldID)
                        let id = intersects[0].object.fieldID;

                        hamburgerFlag = true;
                        ui.showInfoBox(id);
                        
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
                document.getElementById("body").style.cursor = "auto";
                this.buttons.hide()
            }
        }
    }
    setCam = (x, y, z) => {
        cameraTar = { x: x, y: y, z: z }

        ui.updateSliders(this.camera.position.x, this.camera.position.y, this.camera.position.z)
    }
    setBirdView = () => {
        this.camera.position.set(0, 220, 0);
        this.camera.lookAt(this.scene.position);
        cameraTar = { x: 0, y: 220, z: 0 }
        ui.updateSliders(0, 220, 0)
    }
    rotCam = (deg) => {
        let rad = deg * (Math.PI / 180)
        this.camera.position.z = Math.cos(rad) * 220
        this.camera.position.x = Math.sin(rad) * 220
        this.camera.lookAt(this.scene.position);

        cameraTar.x = Math.sin(rad) * 220
        cameraTar.z = Math.cos(rad) * 220
    }
    camHeight = (val) => {
        this.camera.position.y = val;
        this.camera.lookAt(this.scene.position);

        cameraTar.y = val
    }

    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.render(this.scene, this.camera);
        console.log("render leci")
        TWEEN.update();

        // //Animations
        if (!sliderFlag) {
            if (cameraTar.x > this.camera.position.x) { this.camera.position.x += 5 }
            if (cameraTar.x < this.camera.position.x) { this.camera.position.x -= 5 }

            if (cameraTar.y > this.camera.position.y) { this.camera.position.y += 5 }
            if (cameraTar.y < this.camera.position.y) { this.camera.position.y -= 5 }

            if (cameraTar.z > this.camera.position.z) { this.camera.position.z += 5 }
            if (cameraTar.z < this.camera.position.z) { this.camera.position.z -= 5 }
            this.camera.lookAt(this.scene.position);
        }
    }




}
