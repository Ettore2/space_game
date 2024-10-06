//set question mark onclick
import {Player} from "./game_classes.js";
const IMGS_DIR = "../sprites/";
const COLOR_SELECTED_CHARACTER = "rgba(255, 255, 255, 0.18)";
const COLOR_NON_SELECTED_CHARACTER = "rgba(0,0,0,0)";
const COLOR_WHITE = "rgba(255, 255, 255)";
const COLOR_TRANSPARENT = "rgba(0,0,0,0)";

document.getElementById("question_mark_icon").addEventListener("click",function (){
    alert("w to go forward; a,d to turn; enter to shoot");
})

let bntsCharacters = [];
let selectedCharacter = null;



let divTmp

//create spaceship buttons
divTmp = document.getElementById("div_character_selection");
for(let i = 0; i < Player.statsRegistry.length; i++){
    let btnTmp = document.createElement("button");
    bntsCharacters.push(btnTmp);
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
setSelectedCharacter(bntsCharacters[0]);//initialize character selected


function setSelectedCharacter(btn){
    if (selectedCharacter != null){
        selectedCharacter.style.backgroundColor = COLOR_TRANSPARENT;
        selectedCharacter.style.borderColor = COLOR_TRANSPARENT;
    }
    selectedCharacter = btn;
    selectedCharacter.style.backgroundColor = COLOR_SELECTED_CHARACTER;
    selectedCharacter.style.borderColor = COLOR_WHITE

}





