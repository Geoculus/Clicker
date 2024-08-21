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
    goldenHattaraEl: document.getElementById("golden-hattara"),
    fillButton: document.getElementById('feedBtn'),
    resetButton: document.getElementById("reset-btn"),
    musicToggleButton: document.getElementById('music-toggle-button'),
    audioToggleButton: document.getElementById("audio-toggle-button"),
    music: document.getElementById('background-music'),
    musicIcon: document.getElementById('music-toggle-icon'),
    audioIcon: document.getElementById('audio-toggle-icon'),
    clickSound: document.getElementById("click-sound"),
    noMoneySound: document.getElementById("no-money-sound"),
    kachingSound: document.getElementById("kaching-sound"),
    yummySound: document.getElementById("yummy-sound"),
    goldenHattaraSpawnSound: document.getElementById("golden-hattara-spawn-sound"),
    goldenHattaraClickSound: document.getElementById("golden-hattara-click-sound"),
    musicVolumeSlider: document.getElementById("music-volume-slider"),
    soundVolumeSlider: document.getElementById("sound-volume-slider"),
    
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
    totalHattaraAmount: 0,
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

//golden hattara

function spawnGoldenHattara() {
    const chance = Math.random();

    if (chance <=0.05) {
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);

        elements.goldenHattaraEl.style.left = `${x}px`;
        elements.goldenHattaraEl.style.top = `${y}px`;
        elements.goldenHattaraEl.style.display = 'block';

        playGoldenHattaraSpawn();

        hideTimeout = setTimeout(() => {
            elements.goldenHattaraEl.style.display = 'none';
        }, 30000);
    }
}

elements.goldenHattaraEl.addEventListener("click", function(){
    if(gameData.totalHattaraAmount<5000){
        gameData.hattaraAmount+=3500;
        gameData.totalHattaraAmount+=3500;
    }else {
        gameData.hattaraAmount+=Math.floor(gameData.totalHattaraAmount*0.2);
    }
    
    elements.goldenHattaraEl.style.display = 'none';
    displayNumbers();
    playGoldenHattaraClick();
})

function incrementHattarasPerSec() {
    gameData.hattaraAmount += gameData.hattarasPerSec;
    gameData.totalHattaraAmount += gameData.hattarasPerSec;
    displayNumbers();
}

/*
function handlePurchase(cost, amount, upgradeType) {
    //if is money
    if (gameData.hattaraAmount >= cost) {
        gameData.hattaraAmount -= cost;
        gameData[upgradeType] += amount;
        showText(elements.kachingEl);
        displayNumbers();
        saveProgress();
        playKaching();

    } 
    //if no money
    else {
        showText(elements.alertEl);
        playNoMoneyEffect();
    }
}*/

function handlePurchase(index) {
    const powerUp = powerUps[index];

    if (gameData.hattaraAmount >= powerUp.cost) {
        // Deduct the cost from the player's hattaraAmount
        gameData.hattaraAmount -= powerUp.cost;

        // Apply the power-up effect
        gameData[powerUp.type] += powerUp.amount;

        // Increase the cost for the next purchase
        powerUp.cost = Math.ceil(powerUp.cost * 1.1);

        // Update the display for the power-up's new cost
        const buttonElement = document.getElementById(powerUp.element);
        buttonElement.innerText = `${powerUp.name} +${powerUp.amount} \n Cost: ${powerUp.cost} Hattaras`;

        // Show feedback and update game data
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
function playYummy() {
    elements.yummySound.currentTime = 0;
    elements.yummySound.play();
}
function playGoldenHattaraSpawn() {
    elements.goldenHattaraSpawnSound.currentTime = 0;
    elements.goldenHattaraSpawnSound.play();
}

function playGoldenHattaraClick() {
    elements.goldenHattaraClickSound.currentTime = 0;
    elements.goldenHattaraClickSound.play();
}

//sounds array
const allSounds = [elements.clickSound,elements.kachingSound,elements.noMoneySound, elements.yummySound, elements.goldenHattaraClickSound, elements.goldenHattaraSpawnSound];
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

elements.audioToggleButton.addEventListener("click", function() {
    const isMuted = elements.kachingSound.muted;  // Check if the sound is currently muted
    
    if (isMuted) {
        // Unmute all sounds
        elements.audioIcon.src = 'images/audioEmoji.png'; // Change to the unmute icon
        allSounds.forEach(sound => {
            sound.muted = false; // Unmute each sound
        });
    } else {
        // Mute all sounds
        elements.audioIcon.src = 'images/noAudioEmoji.png'; // Change to the mute icon
        allSounds.forEach(sound => {
            sound.muted = true; // Mute each sound
        });
    }
});

// POUTACLICK
elements.possu.addEventListener("click", () => {
    gameData.hattaraAmount += gameData.hattarasPerClick;
    gameData.totalHattaraAmount += gameData.hattarasPerClick;
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
        playYummy();
    }
});

//Sliders
elements.musicVolumeSlider.addEventListener("input", function() {
    let volume = elements.musicVolumeSlider.value / 100;
    elements.music.volume = volume;

});



elements.soundVolumeSlider.addEventListener("input", function() {
    let volume = elements.soundVolumeSlider.value / 100;
    allSounds.forEach(sound => {
        sound.volume = volume;
    })

});


/////

// Possu disabler
function disablePossu() {
    if (gameData.currentWidth >= 100) {
        elements.possu.style.display = "none";
        elements.winTextEl.style.visibility = "visible";
    }
}

// Power-up purchases
const powerUps = [
    { element: 'click+1', cost: 100, amount: 1, type: 'hattarasPerClick', name: 'Hattaras per click' },
    { element: 'click+2', cost: 210, amount: 2, type: 'hattarasPerClick', name: 'Hattaras per click' },
    { element: 'click+10', cost: 5500, amount: 50, type: 'hattarasPerClick', name: 'Hattaras per click' },
    { element: 'click+400', cost: 64000, amount: 500, type: 'hattarasPerClick', name: 'Hattaras per click' },
    { element: 'persec+1', cost: 110, amount: 1, type: 'hattarasPerSec', name: 'Hattaras per sec' },
    { element: 'persec+2', cost: 230, amount: 2, type: 'hattarasPerSec', name: 'Hattaras per sec' },
    { element: 'persec+10', cost: 6000, amount: 50, type: 'hattarasPerSec', name: 'Hattaras per sec' },
    { element: 'persec+100', cost: 13000, amount: 100, type: 'hattarasPerSec', name: 'Hattaras per sec' },
    { element: 'persec+300', cost: 70000, amount: 500, type: 'hattarasPerSec', name: 'Hattaras per sec' },
    { element: 'persec+1000', cost: 150000, amount: 1000, type: 'hattarasPerSec', name: 'Hattaras per sec' },
];

/*
powerUps.forEach(({ element, cost, amount, type }) => {
    document.getElementById(element).addEventListener('click', () => handlePurchase(cost, amount, type));
});*/
powerUps.forEach((powerUp, index) => {
    const buttonElement = document.getElementById(powerUp.element);
    buttonElement.innerText = `${powerUp.name} +${powerUp.amount} \n Cost: ${powerUp.cost} Hattaras`;

    buttonElement.addEventListener('click', () => handlePurchase(index));
});


// Increment hattaras per second every second
setInterval(incrementHattarasPerSec, 1000);

// Save progress periodically
setInterval(saveProgress, 2000);

//spawn golden hattara
setInterval(spawnGoldenHattara,10000);

setInterval(disablePossu, 1);


