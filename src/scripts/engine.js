const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox:document.getElementById("score_points"),
    },
    cardsSprites:{
        avatar: document.getElementById('card-image'),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-cards"),
        computer: document.getElementById("computer-field-cards"),
    },
    playersSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions:{
        button: document.getElementById("next-duel"),
    },
};

const volumeSlider = document.querySelector("#volume");
const bgm = document.getElementById("bgm");
const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
];

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function removeAllCardsImages(){
    let {computerBOX, player1BOX} = state.playersSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "win";
        state.score.playerScore++;
    }else if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);
    return duelResults;
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function hiddenCardsDetails(){
    state.cardsSprites.avatar.src = " ";
    state.cardsSprites.name.innerText = " ";
    state.cardsSprites.type.innerText = " ";
}

async function ShowHiddenCardFieldsImages(value){
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }else{
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function setCardsField(cardId){
    let computerCardId = await getRandomCardId();
    let duelResults = await checkDuelResults(cardId, computerCardId);

    await removeAllCardsImages();
    await ShowHiddenCardFieldsImages(true);
    await hiddenCardsDetails();
    await drawCardsInField(cardId, computerCardId);
    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function drawSelectCard(index){
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", `${pathImages}card-back.png`);
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");
    
    if(fieldSide === state.playersSides.player1){
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }
    return cardImage;
}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardsSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}
const handleVolume = (x) =>{
    bgm.volume = x.target.value;
}

volumeSlider.addEventListener("input", handleVolume);

function init(){
    ShowHiddenCardFieldsImages(false);
    bgm.play();

    drawCards(5, state.playersSides.player1);
    drawCards(5, state.playersSides.computer);
}

init();
