//set question mark onclick
import {
    arrayRemove,
    GameInstance,
    GameMode,
    Player,
    SESSION_GAME_MODE_ID,
    SESSION_SPACESHIP_ID,
    SESSION_MODIFIERS_IDS
} from "./game_classes.js";
const IMGS_DIR = "../sprites/";
const COLOR_SELECTED_CHARACTER = "rgba(255, 255, 255, 0.18)";
const COLOR_NON_SELECTED_CHARACTER = "rgba(0,0,0,0)";
const COLOR_WHITE = "rgba(255, 255, 255)";
const COLOR_TRANSPARENT = "rgba(0,0,0,0)";
const INFO_MODIFIER_FADE_OUT_DELAY = 2000;

document.getElementById("question_mark_icon").addEventListener("click",function (){
    alert("w to go forward; a,d to turn; enter or space to shoot; esc to pause");
})
document.getElementById("btn_play").addEventListener("click",function (){
    let tmp;

    //save selected character on js session
    tmp = null;
    for(let i = 0; i < btnsCharacters.length && tmp == null;i++){
        if(btnsCharacters[i] === selectedCharacter){
            tmp = i;
        }
    }
    sessionStorage.setItem(SESSION_SPACESHIP_ID, tmp);

    //save selected game mode on js session
    tmp = null;
    for(let i = 0; i < btnsGameModes.length && tmp == null;i++){
        if(btnsGameModes[i] === selectedGameMode){
            tmp = i;
        }
    }
    sessionStorage.setItem(SESSION_GAME_MODE_ID, tmp);

    //save selected modifiers on js session
    tmp = [];
    for(let i = 0; i < btnsModifiers.length;i++){
        if(selectedModifiers.includes(btnsModifiers[i])){
            tmp.push(i);
        }
    }
    sessionStorage.setItem(SESSION_MODIFIERS_IDS, tmp);


    window.location.href = "./game.html";
})

let btnsCharacters = [];
let selectedCharacter = null;

let btnsGameModes = [];
let selectedGameMode = null;

let btnsModifiers = [];
let selectedModifiers = [];
let selectedModifiersInfoTimer
let textModifierInfo = document.getElementById("text_modifier_info");



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

//create game modifiers buttons
divTmp = document.getElementById("div_game_modifiers_selection");
for(let i = 0; i < GameInstance.MODIFIERS.length; i++){
    let btnTmp = document.createElement("button");
    btnsGameModes.push(btnTmp);
    divTmp.appendChild(btnTmp);
    btnsModifiers.push(btnTmp);
    btnTmp.classList.add("playable_game_modifier_icon");
    btnTmp.style.background = "rgba(0,0,0,0)";
    btnTmp.style.backgroundImage = "url('"+IMGS_DIR + GameInstance.MODIFIERS[i].img+"')";
    btnTmp.style.backgroundPosition = "center";
    btnTmp.style.backgroundSize = "80%";
    btnTmp.style.backgroundRepeat = "no-repeat";
    btnTmp.addEventListener("click", function(){
        setGameModifier(event.target);
    })
}


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
function setGameModifier(btn){
    if (selectedModifiers.includes(btn)){
        arrayRemove(selectedModifiers,btn);
        btn.style.backgroundColor = COLOR_TRANSPARENT;
        btn.style.borderColor = COLOR_TRANSPARENT;
    }else{
        selectedModifiers.push(btn);
        btn.style.backgroundColor = COLOR_SELECTED_CHARACTER;
        btn.style.borderColor = COLOR_WHITE
    }

    //info animation
    let text = null;
    for(let i = 0; i < btnsModifiers.length && text == null; i++){
        if(btnsModifiers[i] === btn){
            text = GameInstance.MODIFIERS[i].name + ": " + (selectedModifiers.includes(btn) ? "on" : "off");
        }
    }
    textModifierInfo.innerText = text;
    textModifierInfo.style.opacity = "1";
    textModifierInfo.classList.remove("fade_out");
    setTimeout(function (){
        textModifierInfo.classList.add("fade_out");
        textModifierInfo.style.opacity = "0";
    }, INFO_MODIFIER_FADE_OUT_DELAY)



}





