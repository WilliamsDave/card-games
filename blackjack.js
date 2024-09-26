let dealerSum = 0;
let yourSum = 0;
let hidden;
let deck;

let canHit = true; 
let dealerCards = [];
let playerCards = [];

// Initialize game on window load
window.onload = function() {
    initializeGame();
}

function initializeGame() {
    buildDeck();
    shuffleDeck();
    startGame();
}

// Build a standard deck of cards
function buildDeck() {
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const types = ["C", "D", "H", "S"];
    deck = [];

    for (let type of types) {
        for (let value of values) {
            deck.push(`${value}-${type}`); // e.g., "A-C"
        }
    }
}

// Shuffle the deck randomly
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        const j = Math.floor(Math.random() * deck.length);
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap cards
    }
}

// Start the game by dealing cards
function startGame() {
    hidden = deck.pop();
    dealerCards.push(hidden);
    
    const dealerVisibleCard = deck.pop();
    dealerCards.push(dealerVisibleCard);
    
    dealerSum = calculateHandValue(dealerCards);

    displayCard(dealerVisibleCard, "dealer-cards");
    updateDealerSum(dealerVisibleCard);

    for (let i = 0; i < 2; i++) {
        playerDrawCard();
    }
    
    updatePlayerSum();

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

// Handle the player's hit action
function hit() {
    if (!canHit) return;

    playerDrawCard();

    if (yourSum > 21) {
        canHit = false;
        stay();
        document.getElementById("results").innerText = "You Lose!";
    }
}

// Draw a card for the player
function playerDrawCard() {
    const card = deck.pop();
    playerCards.push(card);
    yourSum = calculateHandValue(playerCards);
    
    displayCard(card, "your-cards");
    updatePlayerSum();
}

// Handle the stay action
function stay() {
    revealDealerCard();

    while (dealerSum < 17) {
        dealerHit();
    }

    finalizeGame();
}

function revealDealerCard() {
    document.getElementById("hidden").src = `./cards/${hidden}.png`;
}

function finalizeGame() {
    dealerSum = calculateHandValue(dealerCards);
    canHit = false;

    const resultMessage = determineResult();
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = resultMessage;
}

function determineResult() {
    if (yourSum > 21) return "You Lose!";
    if (dealerSum > 21) return "You Win!";
    if (yourSum === dealerSum) return "Tie!";
    return yourSum > dealerSum ? "You Win!" : "You Lose!";
}

// Draw a card for the dealer
function dealerHit() {
    const card = deck.pop();
    dealerCards.push(card);
    dealerSum = calculateHandValue(dealerCards);
    
    displayCard(card, "dealer-cards");
}

// Calculate the total value of a hand
function calculateHandValue(hand) {
    let totalValue = 0;
    let aceCount = 0;

    hand.forEach(card => {
        const value = getValue(card);
        totalValue += value;
        if (card[0] === 'A') aceCount++;
    });

    while (totalValue > 21 && aceCount > 0) {
        totalValue -= 10; 
        aceCount--;
    }

    return totalValue;
}

// Get the value of a single card
function getValue(card) {
    const value = card.split("-")[0];

    if (isNaN(value)) {
        return value === "A" ? 11 : 10; 
    }
    return parseInt(value);
}

// Display a card image
function displayCard(card, elementId) {
    const cardImg = document.createElement("img");
    cardImg.src = `./cards/${card}.png`;
    document.getElementById(elementId).append(cardImg);
}

// Update dealer's visible sum
function updateDealerSum(card) {
    document.getElementById("dealer-sum").innerText = getValue(card);
}

// Update player's sum display
function updatePlayerSum() {
    document.getElementById("your-sum").innerText = yourSum;
}
