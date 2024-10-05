import {GameInstance, GameObject, Joystick, Player} from "./game_classes.js";
const FRAMES_DELAY = 20;

let keyUp = "w";
let keyLeft = "a";
let keyRight = "d";
let keyActionA = "Enter";
let upFlag = false;
let leftFlag = false;
let rightFlag = false;
let actionAFlag = false;

let OUT_OF_SCREEN_DIV_WIDTH_PERCENTAGE = 20;
let DIV_MID_WIDTH_PERCENTAGE = 60;
let DIV_LEFT_WIDTH_PERCENTAGE = (100 - DIV_MID_WIDTH_PERCENTAGE)/2;
let JOYSTICK_SIZE_PERCENTAGE = 100;
let ACTION_A_BTN_SIZE_PERCENTAGE = 60;

let divLeft = document.getElementById("div_left")
let divMid = document.getElementById("div_mid")
let divRight = document.getElementById("div_right")

let w = window.innerWidth*100/100;
let h = window.innerHeight*100/100;

let canvas = document.getElementById("game_canvas");

let pointsDiv = document.createElement("div");
pointsDiv.classList.add("icon_div");
let pointsText = document.createElement("p");
let pointsImg = document.createElement("img");
pointsImg.classList.add("icon");
pointsImg.classList.add("margin_right");
pointsText.classList.add("margin_left");
pointsDiv.appendChild(pointsText)
pointsDiv.appendChild(pointsImg)

let healthDiv = document.createElement("div");
healthDiv.classList.add("icon_div");
let healthText = document.createElement("p");
let healthImg = document.createElement("img");
healthImg.classList.add("icon");
healthImg.classList.add("margin_left");
healthText.classList.add("margin_right");
healthDiv.appendChild(healthImg)
healthDiv.appendChild(healthText)

let outOfScreenDiv = document.createElement("div");
outOfScreenDiv.classList.add("out_of_screen_div");
outOfScreenDiv.style.width = OUT_OF_SCREEN_DIV_WIDTH_PERCENTAGE+"%";
let outOfScreenText = document.createElement("p");
outOfScreenText.classList.add("out_of_screen_text");
outOfScreenDiv.appendChild(outOfScreenText);
let joystickDiv= document.createElement("div");
let joystickCanvas = document.createElement("canvas");
joystickDiv.appendChild(joystickCanvas);
joystickDiv.style.width ="fit-content"
joystickDiv.style.height ="fit-content"
joystickDiv.style.padding="2%";

let actionABtn = document.createElement("button");
actionABtn.id = "action_a_btn";
actionABtn.type = "button"
actionABtn.addEventListener("mousedown", actionAEmulatorStart)
actionABtn.addEventListener("touchstart", actionAEmulatorStart)
actionABtn.addEventListener("mouseup", actionAEmulatorEnd)
actionABtn.addEventListener("mouseleave", actionAEmulatorEnd)
actionABtn.addEventListener("touchcancel", actionAEmulatorEnd)
actionABtn.addEventListener("touchend", actionAEmulatorEnd)

let canvasWidthPx
let joystickSize

divMid.appendChild(outOfScreenDiv)
if(h > w){
    if(h-w >= h*20/100){
        canvasWidthPx = w;
    }else{
        canvasWidthPx = h - h*20/100
    }

    divMid.style.width = "100%";
    divMid.style.height = h+"px";
    divMid.style.display = "block";
    divLeft.style.display = "none";
    divRight.style.display = "none";
    let divTmp = document.createElement("div");//div for points and health
    divTmp.style.display = "flex"
    divTmp.appendChild(healthDiv)
    divTmp.appendChild(pointsDiv)
    divMid.appendChild(divTmp)

    divTmp = document.createElement("div");//div for buttons
    divTmp.style.marginTop="auto";
    divTmp.style.marginBottom="0px";
    divTmp.style.display="flex";
    divMid.appendChild(divTmp)
    divTmp.appendChild(joystickDiv)
    divTmp.appendChild(actionABtn)

    joystickSize = w*JOYSTICK_SIZE_PERCENTAGE/100/2;
    if((h-canvasWidthPx)*80/100 < joystickSize){
        joystickSize = (h-canvasWidthPx)*80/100;
    }//joystick size
    actionABtn.style.width = joystickSize*ACTION_A_BTN_SIZE_PERCENTAGE/100+"px";
    joystickDiv.style.margin = "0px auto 0px 0px";
}else {
    if(h > w*60/100){
        canvasWidthPx = w*DIV_MID_WIDTH_PERCENTAGE/100;
    }else {
        canvasWidthPx = h;
    }
    divMid.style.width = DIV_MID_WIDTH_PERCENTAGE+"%";
    divLeft.style.width = DIV_LEFT_WIDTH_PERCENTAGE+"%";
    divRight.style.width = DIV_LEFT_WIDTH_PERCENTAGE+"%";
    divMid.style.display = "flex";
    divRight.appendChild(pointsDiv)
    divLeft.appendChild(healthDiv)
    divLeft.appendChild(joystickDiv)
    divRight.appendChild(actionABtn)

    joystickSize = divLeft.getBoundingClientRect().width*JOYSTICK_SIZE_PERCENTAGE/100;
    joystickDiv.style.margin = (h*90/100-joystickSize)+"px auto 0% auto";
    actionABtn.style.margin = (h*85/100-joystickSize*ACTION_A_BTN_SIZE_PERCENTAGE/100)+"px auto 0% 30%";
    actionABtn.style.width = joystickSize*ACTION_A_BTN_SIZE_PERCENTAGE/100+"px";
}//build the screen
outOfScreenDiv.style.top = canvasWidthPx/3+"px"
if(h > w){
    outOfScreenDiv.style.left = (canvasWidthPx - canvasWidthPx*OUT_OF_SCREEN_DIV_WIDTH_PERCENTAGE/100)/2+"px"
}else {
    outOfScreenDiv.style.left = (w*DIV_LEFT_WIDTH_PERCENTAGE/100+(canvasWidthPx - canvasWidthPx*OUT_OF_SCREEN_DIV_WIDTH_PERCENTAGE/100)/2)+"px"
}//set out of screen text pos
canvas.style.height = canvasWidthPx+"px"
canvas.style.width = canvasWidthPx+"px"


let elements = {
    pointsText : pointsText,
    pointsImg : pointsImg,
    healthText : healthText,
    healthImg : healthImg,
    outOfScreenDiv : outOfScreenDiv,
    outOfScreenText : outOfScreenText,

}
let game = new GameInstance(canvas,FRAMES_DELAY,0,0,elements);
let joystick = new Joystick(joystickCanvas,joystickSize,joystickSize,joystickSize*30/100,joystickSize*14/100,joystickSize*2/100,joystickSize*70/100);
joystick.setRotationOffset(0);
Joystick.initializeListeners(joystick);

let intervalId = setInterval(function() {
    if(upFlag || joystick.speed >= 85){
        game.player.setInput(GameObject.DIR_UP);
    }

    if(leftFlag){
        game.player.setInput(GameObject.DIR_LEFT);
    }
    if(rightFlag){
        game.player.setInput(GameObject.DIR_RIGHT);
    }

    /*
    if(joystick.speed > 0){
        //console.log(joystick.angle_in_degrees);
        //console.log(joystick.angle_in_degrees +"     "+ game.player.rot)
        //console.log(Math.abs(joystick.angle_in_degrees - game.player.rot) +"     "+ game.player.stats.rotSpeed*2)
        //console.log("------------------------------------")
    }

     */

    if(Math.abs(joystick.angle_in_degrees - game.player.rot) > game.player.stats.rotSpeed*2.5 && joystick.speed > 0){
        if((joystick.angle_in_degrees +360 - game.player.rot)%360 > 180){
            game.player.setInput(GameObject.DIR_RIGHT);
        }else{
            game.player.setInput(GameObject.DIR_LEFT);
        }
    }


    if(actionAFlag){
        game.player.setInput(Player.ACTION_A);
    }

    game.doLoop()
}, FRAMES_DELAY);


document.addEventListener("keydown", function(e){
    //console.log("down -"+e.key+"-")
    switch (e.key){
        case keyUp:
            //console.log("keyUp")
            game.player.setInput(GameObject.DIR_UP);
            upFlag = true;
            break
        case keyLeft:
            //console.log("keyLeft")
            game.player.setInput(GameObject.DIR_LEFT);
            leftFlag = true;
            break
        case keyRight:
            //console.log("keyRight")
            game.player.setInput(GameObject.DIR_RIGHT);
            rightFlag = true;
            break
        case keyActionA:
            //console.log("keyActionA")
            game.player.setInput(Player.ACTION_A);
            actionAFlag = true;
            break
    }
});
document.addEventListener("keyup", function(e){
    //console.log("up -"+e.key+"-")
    switch (e.key){
        case keyUp:
            //console.log("keyUp")
            upFlag = false;
            break
        case keyLeft:
            //console.log("keyLeft")
            leftFlag = false;
            break
        case keyRight:
            //console.log("keyRight")
            rightFlag = false;
            break
        case keyActionA:
            //console.log("keyActionA")
            actionAFlag = false;
            break
    }

});

function actionAEmulatorStart(){
    actionAFlag = true;
    actionABtn.style.boxShadow="0 1px #9a0000"
    actionABtn.style.translate="0 4px"
}
function actionAEmulatorEnd(){
    actionAFlag = false;
    actionABtn.style.boxShadow="0 5px #9a0000"
    actionABtn.style.translate="0 0"
}
