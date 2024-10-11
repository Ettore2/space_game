import {
    GameInstance,
    GameObject,
    Joystick,
    Player,
    SESSION_GAME_MODE_ID,
    SESSION_SPACESHIP_ID,
    SESSION_MODIFIERS_IDS, GameMode
} from "./game_classes.js";
const FRAMES_DELAY = 20;

//check js session
if(sessionStorage.getItem(SESSION_GAME_MODE_ID) == null ||
    sessionStorage.getItem(SESSION_SPACESHIP_ID) == null ||
    sessionStorage.getItem(SESSION_MODIFIERS_IDS) == null){
    window.location.href = "./menu.html";

}

//constrols things
let keyUp = "w";
let keyLeft = "a";
let keyRight = "d";
let keyAction1A = "Enter";
let keyAction2A = " ";
let keyPause = "Escape";
let upFlag = false;
let leftFlag = false;
let rightFlag = false;
let actionAFlag = false;

//screen construction things-------------------------------------------------------
let OUT_OF_SCREEN_DIV_WIDTH_PERCENTAGE = 20;
let DIV_MID_WIDTH_PERCENTAGE = 60;
let DIV_LEFT_WIDTH_PERCENTAGE = (100 - DIV_MID_WIDTH_PERCENTAGE)/2;
let JOYSTICK_SIZE_PERCENTAGE = 100;
let ACTION_A_BTN_SIZE_PERCENTAGE = 60;

let divLeft = document.getElementById("div_left")
let divMid = document.getElementById("div_mid")
let divRight = document.getElementById("div_right")

let w = window.innerWidth;
let h = window.innerHeight;

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

//death screen
let deathDiv = document.createElement("div");
{
    document.body.appendChild(deathDiv);
    deathDiv.style.visibility = "hidden";
    deathDiv.classList.add("death_div");
    let btnTmp,textTmp;

    btnTmp = document.createElement("button");
    textTmp = document.createElement("p");
    btnTmp.appendChild(textTmp);
    deathDiv.appendChild(btnTmp);
    textTmp.innerText = "quit";
    btnTmp.classList.add("death_btn");
    textTmp.classList.add("death_btn_text");
    btnTmp.addEventListener("click",function (){window.location.href = "./menu.html";});

    btnTmp = document.createElement("button");
    textTmp = document.createElement("p");
    btnTmp.appendChild(textTmp);
    deathDiv.appendChild(btnTmp);
    textTmp.innerText = "play again";
    btnTmp.classList.add("death_btn");
    textTmp.classList.add("death_btn_text");
    btnTmp.addEventListener("click",function (){window.location.href = "./game.html";});

}

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
    if(h-w >= h*40/100){
        canvasWidthPx = w;
    }else{
        canvasWidthPx = h - h*40/100
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
outOfScreenDiv.style.top = canvasWidthPx/3+"px";
deathDiv.style.top = canvasWidthPx/3+"px";
deathDiv.style.left = (w-deathDiv.getBoundingClientRect().width)/2+"px";
if(h > w){
    outOfScreenDiv.style.left = (canvasWidthPx - canvasWidthPx*OUT_OF_SCREEN_DIV_WIDTH_PERCENTAGE/100)/2+"px"
}else {
    outOfScreenDiv.style.left = (w*DIV_LEFT_WIDTH_PERCENTAGE/100+(canvasWidthPx - canvasWidthPx*OUT_OF_SCREEN_DIV_WIDTH_PERCENTAGE/100)/2)+"px"
}//set out of screen text pos
canvas.style.height = canvasWidthPx+"px";
canvas.style.width = canvasWidthPx+"px";


//cage creation things-------------------------------------------------------
let elements = {
    pointsText : pointsText,
    pointsImg : pointsImg,
    healthText : healthText,
    healthImg : healthImg,
    outOfScreenDiv : outOfScreenDiv,
    deathDiv : deathDiv,
    outOfScreenText : outOfScreenText,

}

//session elaboration
let playerId = parseInt(sessionStorage.getItem(SESSION_SPACESHIP_ID));
let gameModeId = parseInt(sessionStorage.getItem(SESSION_GAME_MODE_ID));
let modifiers = []
let vTmp = sessionStorage.getItem(SESSION_MODIFIERS_IDS).split(",");
for(let i = 0; i < vTmp.length; i++){
    modifiers.push(parseInt(vTmp[i]));
}

let game = new GameInstance(canvas,FRAMES_DELAY,playerId,gameModeId,modifiers,elements);
let joystick = new Joystick(joystickCanvas,joystickSize,joystickSize,joystickSize*30/100,joystickSize*14/100,joystickSize*2/100,joystickSize*70/100);
joystick.setRotationOffset(0);
Joystick.initializeListeners(joystick);

let intervalId = setInterval(function() {
    if(upFlag || joystick.speed >= 85 || game.activeModifiers.includes(GameInstance.MOD_CANT_STOP_ID)){
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


    if(actionAFlag || game.activeModifiers.includes(GameInstance.MOD_ALWAYS_SHOOT_ID)){
        game.player.setInput(Player.ACTION_A);
    }

    game.doLoop()
}, FRAMES_DELAY);//framerate


//functions-----------------------------------------------------------------
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
        case keyAction1A:
        case keyAction2A:
            //console.log("keyActionA")
            game.player.setInput(Player.ACTION_A);
            actionAFlag = true;
            break
        case keyPause:
            switch (game.gameState){
                case GameInstance.STATE_PLAY:
                    game.setGameState(GameInstance.STATE_PAUSE);
                    break;
                case GameInstance.STATE_PAUSE:
                    game.setGameState(GameInstance.STATE_PLAY);
                    break;
            }
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
        case keyAction1A:
        case keyAction2A:
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
