//set question mark onclick
import {GameMode, Player} from "./game_classes.js";
const IMGS_DIR = "../sprites/";
const COLOR_SELECTED_CHARACTER = "rgba(255, 255, 255, 0.18)";
const COLOR_NON_SELECTED_CHARACTER = "rgba(0,0,0,0)";
const COLOR_WHITE = "rgba(255, 255, 255)";
const COLOR_TRANSPARENT = "rgba(0,0,0,0)";

document.getElementById("question_mark_icon").addEventListener("click",function (){
    alert("w to go forward; a,d to turn; enter to shoot");
})

let btnsCharacters = [];
let selectedCharacter = null;
let btnsGameModes = [];
let selectedGameMode = null;



let divTmp

//responsive
let w = window.innerWidth*100/100;
let h = window.innerHeight*100/100;
if(w>h){
    document.getElementById("div_main").style.display = "flex";
    document.getElementById("div_character").style.width = "50%";
    document.getElementById("div_game_mode").style.width = "50%";
}

//create spaceship buttons
divTmp = document.getElementById("div_character_selection");
for(let i = 0; i < Player.statsRegistry.length; i++){
    let btnTmp = document.createElement("button");
    btnsCharacters.push(btnTmp);
    divTmp.appendChild(btnTmp);
    btnTmp.classList.add("playable_ship_icon");
    btnTmp.style.background = "rgba(0,0,0,0)";
    btnTmp.style.backgroundImage = "url('"+IMGS_DIR + Player.statsRegistry[i].icon+"')";
    btnTmp.style.backgroundPosition = "center";
    btnTmp.style.backgroundSize = "80%";
    btnTmp.style.backgroundRepeat = "no-repeat";
    btnTmp.addEventListener("click", function(){
        setSelectedCharacter(event.target);
    })
}
setSelectedCharacter(btnsCharacters[0]);//initialize character selected

//create game mode buttons
divTmp = document.getElementById("div_game_mode_selection");
for(let i = 0; i < GameMode.TOTAL_GAME_MODES; i++){
    let gameModeTmp = GameMode.getGameMode(i,null);
    let btnTmp = document.createElement("button");
    btnsGameModes.push(btnTmp);
    divTmp.appendChild(btnTmp);
    btnTmp.classList.add("playable_game_mode_icon");
    btnTmp.style.background = "rgba(0,0,0,0)";
    btnTmp.style.backgroundImage = "url('"+IMGS_DIR + gameModeTmp.objectiveImg+"')";
    btnTmp.style.backgroundPosition = "center";
    btnTmp.style.backgroundSize = "80%";
    btnTmp.style.backgroundRepeat = "no-repeat";
    btnTmp.addEventListener("click", function(){
        setSelectedGameMode(event.target);
    })
}
setSelectedGameMode(btnsGameModes[0]);//initialize character selected


function setSelectedCharacter(btn){
    if (selectedCharacter != null){
        selectedCharacter.style.backgroundColor = COLOR_TRANSPARENT;
        selectedCharacter.style.borderColor = COLOR_TRANSPARENT;
    }
    selectedCharacter = btn;
    selectedCharacter.style.backgroundColor = COLOR_SELECTED_CHARACTER;
    selectedCharacter.style.borderColor = COLOR_WHITE

}
function setSelectedGameMode(btn){
    if (selectedGameMode != null){
        selectedGameMode.style.backgroundColor = COLOR_TRANSPARENT;
        selectedGameMode.style.borderColor = COLOR_TRANSPARENT;
    }
    selectedGameMode = btn;
    selectedGameMode.style.backgroundColor = COLOR_SELECTED_CHARACTER;
    selectedGameMode.style.borderColor = COLOR_WHITE

}





