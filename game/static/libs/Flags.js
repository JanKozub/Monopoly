var hamburgerFlag = false;
var sliderFlag = false;
var buttons_flag = false;

hamburgerFlag_switch = (value) => {
    hamburgerFlag = value;
}

let buttons = [].slice.call(document.getElementsByClassName("hud_buttons"));
console.log(buttons)
buttons.forEach(button => {
    console.log(button.id)
    document.getElementById(button.id).onmouseover = () => {
        buttons_flag = true;
    }
    document.getElementById(button.id).onmouseleave = () => {
        buttons_flag = false;
    }
});

let idsToFlag = ["buymenu", "avatar"]

idsToFlag.forEach(element => {
    document.getElementById(element).onmouseover = () => {
        buttons_flag = true;
    }
    document.getElementById(element).onmouseleave = () => {
        buttons_flag = false;
    }
});