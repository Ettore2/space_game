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

let w = window.innerWidth*100/100;
let h = window.innerHeight*100/100;

let canvas = document.getElementById("game_canvas");
let pointsText = document.createElement("p");
let healthText = document.createElement("p");

if(h > w){
    canvas.style.height = w+"px"
    canvas.style.width = w+"px"
    document.getElementById("div_mid").style.width = "100%";
    document.getElementById("div_left").style.display = "none";
    document.getElementById("div_right").style.display = "none";
    document.getElementById("div_mid").appendChild(healthText)
    document.getElementById("div_mid").appendChild(pointsText)

}else {
    if(h > w*60/100){
        canvas.style.height = (w*60/100)+"px"
        canvas.style.width = (w*60/100)+"px"
    }else {
        canvas.style.height = h+"px"
        canvas.style.width = h+"px"
    }
    document.getElementById("div_mid").style.width = "60%";
    document.getElementById("div_left").style.width = "20%";
    document.getElementById("div_right").style.width = "20%";
    document.getElementById("div_right").appendChild(pointsText)
    document.getElementById("div_left").appendChild(healthText)
}


let game = new GameInstance(canvas,FRAMES_DELAY,0,pointsText,healthText);


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
