import {GameInstance, GameObject, Player} from "./game_classes.js";
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

let w = window.innerWidth*100/100;
let h = window.innerHeight*100/100;

let canvas = document.getElementById("game_canvas");

let pointsDiv = document.createElement("div");
pointsDiv.classList.add("icon_div");
let pointsText = document.createElement("p");
let pointsImg = document.createElement("img");
pointsImg.classList.add("icon");
pointsImg.classList.add("rotate270");
pointsImg.classList.add("margin_right");
pointsText.classList.add("margin_left");
pointsDiv.appendChild(pointsText)
pointsDiv.appendChild(pointsImg)

let healthDiv = document.createElement("div");
healthDiv.classList.add("icon_div");
let healthText = document.createElement("p");
let healthImg = document.createElement("img");
healthImg.classList.add("icon");
healthImg.classList.add("rotate270");
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

let canvasWidthPx

if(h > w){
    canvasWidthPx = w;
    document.getElementById("div_mid").style.width = "100%";
    document.getElementById("div_mid").style.display = "block";
    document.getElementById("div_left").style.display = "none";
    document.getElementById("div_right").style.display = "none";
    let divTmp = document.createElement("div");
    divTmp.style.display = "flex"
    divTmp.appendChild(healthDiv)
    divTmp.appendChild(pointsDiv)
    document.getElementById("div_mid").appendChild(divTmp)
}else {
    if(h > w*60/100){
        canvasWidthPx = w*DIV_MID_WIDTH_PERCENTAGE/100;
    }else {
        canvasWidthPx = h;
    }
    document.getElementById("div_mid").style.width = DIV_MID_WIDTH_PERCENTAGE+"%";
    document.getElementById("div_left").style.width = DIV_LEFT_WIDTH_PERCENTAGE+"%";
    document.getElementById("div_right").style.width = DIV_LEFT_WIDTH_PERCENTAGE+"%";
    document.getElementById("div_mid").style.display = "flex";
    document.getElementById("div_right").appendChild(pointsDiv)
    document.getElementById("div_left").appendChild(healthDiv)
    document.getElementById("div_mid").appendChild(outOfScreenDiv)
}
outOfScreenDiv.style.top = canvasWidthPx/3+"px"
if(h > w){
    outOfScreenDiv.style.left = (canvasWidthPx - canvasWidthPx*OUT_OF_SCREEN_DIV_WIDTH_PERCENTAGE/100)/2+"px"
}else {
    outOfScreenDiv.style.left = (w*DIV_LEFT_WIDTH_PERCENTAGE/100+(canvasWidthPx - canvasWidthPx*OUT_OF_SCREEN_DIV_WIDTH_PERCENTAGE/100)/2)+"px"
}
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


let intervalId = setInterval(function() {
    if(upFlag){
        game.player.setInput(GameObject.DIR_UP);
    }
    if(leftFlag){
        game.player.setInput(GameObject.DIR_LEFT);
    }
    if(rightFlag){
        game.player.setInput(GameObject.DIR_RIGHT);
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
