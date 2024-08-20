//Getting all the elements from html
const elements = {
    cookies: document.getElementById("cookies"),
    possu: document.getElementById("possu"),
    meter: document.getElementById("meter"),
    alertEl: document.getElementById("not-enough"),
    kachingEl: document.getElementById("kaching"),
    feedTextEl: document.getElementById("feedText"),
    winTextEl: document.getElementById("winText"),
    hattaraAmountEl: document.getElementById("hattara-amount"),
    hattaraPerSecEl: document.getElementById("hattarasPerSec"),
    hattaraPerClickEl: document.getElementById("hattarasPerClick"),
    fillButton: document.getElementById('feedBtn'),
    resetButton: document.getElementById("reset-btn"),
    musicToggleButton: document.getElementById('music-toggle-button'),
    music: document.getElementById('background-music'),
    musicIcon: document.getElementById('music-toggle-icon'),
    clickSound: document.getElementById("click-sound"),
    noMoneySound: document.getElementById("no-money-sound"),
    kachingSound: document.getElementById("kaching-sound"),
    hattarasArr: [
        document.getElementById("hattara"),
        document.getElementById("hattara1"),
        document.getElementById("hattara2"),
        document.getElementById("hattara3"),
        document.getElementById("hattara4"),
        document.getElementById("hattara5"),
        document.getElementById("hattara6"),
        document.getElementById("hattara7")
    ]
};
const showBubbleBtn = document.getElementById('tutorial-btn');
const textBubble = document.getElementById('textBubble');

showBubbleBtn.addEventListener('click', () => {
    if (textBubble.style.visibility === 'visible') {
        textBubble.style.visibility = 'hidden';
        textBubble.style.opacity = '0';
    } else {
        textBubble.style.visibility = 'visible';
        textBubble.style.opacity = '1';
    }

    event.stopPropagation();
});

document.addEventListener('click', () => {
    // Hide the bubble when clicking anywhere else on the page
    textBubble.style.visibility = 'hidden';
    textBubble.style.opacity = '0';
});

// To prevent the bubble from hiding when you click inside it
textBubble.addEventListener('click', (event) => {
    event.stopPropagation();
});

// Game variables
let gameData = {
    currentWidth: 0,
    hattarasPerSec: 0,
    hattarasPerClick: 1,
    hattaraAmount: 0,
    hattaraClickPlusAmount: 0,
};

// Initialize game
displayNumbers();
displayHattaraMultipliers();

// Load Progress
function loadProgress() {
    Object.keys(gameData).forEach(key => {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
            gameData[key] = parseFloat(storedValue);
        }
    });
    elements.meter.style.width = gameData.currentWidth + '%'; // Restore meter progress
    displayNumbers();
}

window.addEventListener('load', loadProgress);

// Save Progress
function saveProgress() {
    Object.keys(gameData).forEach(key => {
        localStorage.setItem(key, gameData[key]);
    });
}

// Reset Game
function resetGame() {
    Object.keys(gameData).forEach(key => gameData[key] = key === 'hattarasPerClick' ? 1 : 0);
    localStorage.clear();
    elements.meter.style.width = '0%';
    elements.feedTextEl.style.visibility = "hidden";
    elements.winTextEl.style.visibility = "hidden";
    elements.possu.style.display = "block";
    displayNumbers();
    location.reload();
}

elements.resetButton.addEventListener("click", resetGame);

// Functions
function displayNumbers() {
    elements.hattaraAmountEl.innerText = gameData.hattaraAmount;
    elements.hattaraPerClickEl.innerText = gameData.hattarasPerClick;
    elements.hattaraPerSecEl.innerText = gameData.hattarasPerSec;
}

function displayHattaraMultipliers() {
    elements.hattaraPerClickEl.innerText = gameData.hattarasPerClick;
}

function showText(element, duration = 700) {
    element.style.visibility = "visible";
    setTimeout(() => {
        element.style.visibility = "hidden";
    }, duration);
}

function spawnHattaras() {
    let randomNum = Math.floor(Math.random() * elements.hattarasArr.length);
    elements.hattarasArr[randomNum].style.visibility = "visible";
    setTimeout(() => elements.hattarasArr[randomNum].style.visibility = "hidden", 200);
}

function incrementHattarasPerSec() {
    gameData.hattaraAmount += gameData.hattarasPerSec;
    displayNumbers();
}

function handlePurchase(cost, amount, upgradeType) {
    if (gameData.hattaraAmount >= cost) {
        gameData.hattaraAmount -= cost;
        gameData[upgradeType] += amount;
        showText(elements.kachingEl);
        displayNumbers();
        saveProgress();
        playKaching();
    } else {
        showText(elements.alertEl);
        playNoMoneyEffect();
    }
}

//PLAY SOUNDS
function playClickEffect() {
    elements.clickSound.currentTime = 0;
    elements.clickSound.play();
}
function playNoMoneyEffect() {
    elements.noMoneySound.currentTime = 0;
    elements.noMoneySound.play();
}
function playKaching() {
    elements.kachingSound.currentTime = 0;
    elements.kachingSound.play();
}

//Clicking functions:

//Backgrtound music
elements.musicToggleButton.addEventListener("click", function() {
    
    
    if (elements.music.paused) {
        elements.music.play();
        elements.musicIcon.src = 'images/musicIcon.png'; // Change to the pause icon
    } else {
        elements.music.pause();
        elements.musicIcon.src = 'images/noMusicIcon.png'; // Change to the play icon
    }

})

// POUTACLICK
elements.possu.addEventListener("click", () => {
    gameData.hattaraAmount += gameData.hattarasPerClick;
    displayNumbers();
    spawnHattaras();
    saveProgress();
    playClickEffect();
});

// Meter filler
elements.fillButton.addEventListener('click', () => {
    const possuMultiplier = 0.0001;
    if (gameData.hattaraAmount > 0) {
        showText(elements.feedTextEl);
        gameData.currentWidth += 1 * possuMultiplier * gameData.hattaraAmount;
        elements.meter.style.width = Math.min(100, gameData.currentWidth) + '%';
        gameData.hattaraAmount = 0;
        displayNumbers();
        saveProgress();
        disablePossu();
    }
});

// Possu disabler
function disablePossu() {
    if (gameData.currentWidth >= 100) {
        elements.possu.style.display = "none";
        elements.winTextEl.style.visibility = "visible";
    }
}

// Power-up purchases
const powerUps = [
    { element: 'click+1', cost: 100, amount: 1, type: 'hattarasPerClick' },
    { element: 'click+2', cost: 220, amount: 2, type: 'hattarasPerClick' },
    { element: 'click+10', cost: 1100, amount: 10, type: 'hattarasPerClick' },
    { element: 'click+400', cost: 5, amount: 400, type: 'hattarasPerClick' },
    { element: 'persec+1', cost: 110, amount: 1, type: 'hattarasPerSec' },
    { element: 'persec+2', cost: 230, amount: 2, type: 'hattarasPerSec' },
    { element: 'persec+10', cost: 1200, amount: 10, type: 'hattarasPerSec' },
    { element: 'persec+100', cost: 11500, amount: 100, type: 'hattarasPerSec' },
    { element: 'persec+300', cost: 38000, amount: 300, type: 'hattarasPerSec' },
    { element: 'persec+1000', cost: 100000, amount: 1000, type: 'hattarasPerSec' },
];

powerUps.forEach(({ element, cost, amount, type }) => {
    document.getElementById(element).addEventListener('click', () => handlePurchase(cost, amount, type));
});



// Increment hattaras per second every second
setInterval(incrementHattarasPerSec, 1000);

// Save progress periodically
setInterval(saveProgress, 2000);

setInterval(disablePossu, 1);


