let dealerSum = 0;
let yourSum = 0;
let hidden;
let deck;
let canHit = true;
let dealerCards = [];
let playerCards = [];
// Initialize game on window load
window.onload = function () {
  startGame();
};

// Build a standard deck of cards
function buildDeck() {
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  const types = ["C", "D", "H", "S"];
  deck = [];

  for (let type of types) {
    for (let value of values) {
      deck.push(`${value}-${type}`);
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
  buildDeck();
  shuffleDeck();
  hidden = deck.pop();
  dealerCards.push(hidden, deck.pop());

  updateDealerSum(dealerCards.slice(1));
  displayCard(dealerCards[1], "dealer-cards");

  for (let i = 0; i < 2; i++) {
    playerDrawCard();
  }
  document.getElementById("play-again").addEventListener("click", reset);
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
}
function reset() {
  let parent = document.getElementById("your-cards");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  parent = document.getElementById("dealer-cards");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  img = document.createElement("img");
  img.src = "./cards/BACK.png";
  img.setAttribute("id", "hidden");
  parent.appendChild(img);

  playerCards = [];
  dealerCards = [];
  canHit = true;
  yourSum = 0;
  dealerSum = 0;
  startGame();
}
// Handle the player's hit action
function hit() {
  if (!canHit) return;

  playerDrawCard();
  if (yourSum > 21) {
    canHit = false;
    stay();
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
  displayDealerScore();

  const dealerHitWithDelay = () => {
    if (dealerSum < 17) {
      dealerHit();
      setTimeout(dealerHitWithDelay, 1000); // Wait 1 second before the next hit
    } else {
      finalizeGame(); // Finalize the game when dealerSum is 17 or higher
    }
  };

  // Start the dealer hitting after a short delay
  setTimeout(dealerHitWithDelay, 1000);
}

function displayDealerScore() {
  dealerSum = calculateHandValue(dealerCards);
  document.getElementById("dealer-sum").innerText = dealerSum;
}

function revealDealerCard() {
  document.getElementById("hidden").src = `./cards/${hidden}.png`;
}

function finalizeGame() {
  canHit = false;
  const resultMessage = determineResult();
  document.getElementById("results").innerText = resultMessage;
}

function determineResult() {
  //If player busts they always lose
  if (yourSum > 21) return "You Lose";

  //If player doesn't bust but dealer does
  if (yourSum < 21 && dealerSum > 21) return "You win";

  //Blackjack player win
  if (yourSum === 21 && dealerSum !== 21) return "You win - blackjack";

  //If there is a tie that's not a bust
  if (yourSum === dealerSum) return "Push";

  //If neither busts or ties see who is higher
  return yourSum > dealerSum ? "You Win" : "You Lose";
}

// Draw a card for the dealer
function dealerHit() {
  const card = deck.pop();
  dealerCards.push(card);
  displayCard(card, "dealer-cards");
  displayDealerScore();
}

// Calculate the total value of a hand
function calculateHandValue(hand) {
  let totalValue = 0;
  let aceCount = 0;

  hand.forEach((card) => {
    const value = getValue(card);
    totalValue += value;
    if (value === 11) aceCount++; // Count Aces
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
  return isNaN(value) ? (value === "A" ? 11 : 10) : parseInt(value);
}

// Display a card image
function displayCard(card, elementId) {
  const cardImg = document.createElement("img");
  cardImg.src = `./cards/${card}.png`;
  document.getElementById(elementId).append(cardImg);
}

// Update player's sum display
function updatePlayerSum() {
  document.getElementById("your-sum").innerText = yourSum;
}

// Update dealer's visible sum
function updateDealerSum(cards) {
  dealerSum = calculateHandValue(cards);
  document.getElementById("dealer-sum").innerText = dealerSum;
}
