export class Flags {

    hamburgerFlag = false;
    sliderFlag = false;
    buttons_flag = false;

    constructor() {
        let buttons = [].slice.call(document.getElementsByClassName("hud_buttons"));
        buttons.forEach(button => {
            document.getElementById(button.id).onmouseover = () => {
                this.buttons_flag = true;
            }
            document.getElementById(button.id).onmouseleave = () => {
                this.buttons_flag = false;
            }
        });

        let idsToFlag = ["buymenu", "avatar", "menu_button", "menu", "playersList", "buildmenu", "skiptura"]

        idsToFlag.forEach(element => {
            document.getElementById(element).onmouseover = () => {
                this.buttons_flag = true;
            }
            document.getElementById(element).onmouseleave = () => {
                this.buttons_flag = false;
            }
        });
    }
}