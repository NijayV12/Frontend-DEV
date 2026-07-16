// === Game State Variables ===
let randomNumber;       // Holds the correct number to guess (1-100)
let attempts = 0;       // Keeps track of the number of attempts
let previousGuesses = []; // Stores all previous guesses to display to the user

// === DOM Element Selectors ===
// Selecting elements from index.html so we can update them dynamically
const guessInput = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");
const feedbackMsg = document.getElementById("feedback-msg");
const attemptsCount = document.getElementById("attempts-count");
const prevGuessesSpan = document.getElementById("prev-guesses");
const restartBtn = document.getElementById("restart-btn");

// === Start/Reset Game Function ===
// This function runs when the page loads, and when the user clicks 'Play Again'
function initGame() {
    // 1. Generate a random integer between 1 and 100
    randomNumber = Math.floor(Math.random() * 100) + 1;
    
    // 2. Reset the state variables
    attempts = 0;
    previousGuesses = [];
    
    // 3. Reset the UI elements to their starting state
    attemptsCount.textContent = "0";
    prevGuessesSpan.textContent = "-";
    feedbackMsg.textContent = "Start guessing to see hints...";
    feedbackMsg.className = ""; // Remove any status classes (too-low, too-high, correct)
    
    // 4. Reset input field
    guessInput.value = "";
    guessInput.disabled = false;
    guessInput.focus();
    
    // 5. Hide the restart button and show/enable guess button
    restartBtn.classList.add("hidden");
    guessBtn.disabled = false;
    guessBtn.style.opacity = "1";
    
}

// === Check Guess Function ===
// This function contains the core logic of the guessing game
function checkGuess() {
    // Get the value from input field and convert it to a whole number
    const userGuess = parseInt(guessInput.value);

    // --- 1. Input Validation ---
    // Check if the input is empty or not a valid number
    if (isNaN(userGuess)) {
        feedbackMsg.textContent = "⚠️ Please enter a valid number!";
        feedbackMsg.className = "warning";
        return;
    }

    // Check if the number is out of bounds (1 to 100)
    if (userGuess < 1 || userGuess > 100) {
        feedbackMsg.textContent = "⚠️ Number must be between 1 and 100!";
        feedbackMsg.className = "warning";
        return;
    }

    // --- 2. Update Game Stats ---
    attempts++;
    attemptsCount.textContent = attempts;
    
    previousGuesses.push(userGuess);
    // Display guesses as a comma-separated list
    prevGuessesSpan.textContent = previousGuesses.join(", ");

    // --- 3. Guess Evaluation ---
    if (userGuess === randomNumber) {
        // Correct Guess!
        feedbackMsg.textContent = `🎉 Correct! The number was ${randomNumber}. You got it in ${attempts} attempts!`;
        feedbackMsg.className = "correct";
        
        // End the game
        endGame();
    } else if (userGuess < randomNumber) {
        // Too Low
        feedbackMsg.textContent = "📉 Too Low! Try a higher number.";
        feedbackMsg.className = "too-low";
        
        // Clear input to allow the next guess
        guessInput.value = "";
        guessInput.focus();
    } else {
        // Too High
        feedbackMsg.textContent = "📈 Too High! Try a lower number.";
        feedbackMsg.className = "too-high";
        
        // Clear input to allow the next guess
        guessInput.value = "";
        guessInput.focus();
    }
}

// === End Game Function ===
// Called when the user guesses the correct number
function endGame() {
    // Disable inputs so the user can't guess anymore
    guessInput.disabled = true;
    guessBtn.disabled = true;
    guessBtn.style.opacity = "0.5";
    
    // Show the "Play Again" button
    restartBtn.classList.remove("hidden");
    
}

// === Event Listeners ===

// 1. Run initGame when the web page finishes loading
document.addEventListener("DOMContentLoaded", initGame);

// 2. Run checkGuess when user clicks the "Guess" button
guessBtn.addEventListener("click", checkGuess);

// 3. Run checkGuess when user presses "Enter" key in the input field
guessInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkGuess();
    }
});

// 4. Run initGame when user clicks the "Play Again" button
restartBtn.addEventListener("click", initGame);
