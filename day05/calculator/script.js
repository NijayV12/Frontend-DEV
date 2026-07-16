// State Variables
let currentValue = "0";
let previousValue = "";
let currentOperation = null;
let shouldResetScreen = false;
let history = [];

// DOM Elements
const displayCurrent = document.getElementById("display-current");
const displayHistory = document.getElementById("display-history");
const historyToggle = document.getElementById("history-toggle");
const historyDrawer = document.getElementById("history-drawer");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");
const keypad = document.querySelector(".keypad");

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
    // Load local storage preferences
    loadHistory();

    // Event Listeners
    keypad.addEventListener("click", handleKeypadClick);
    document.addEventListener("keydown", handleKeyboardInput);
    historyToggle.addEventListener("click", toggleHistoryDrawer);
    clearHistoryBtn.addEventListener("click", clearAllHistory);

    // Close history drawer when clicking outside the calculator container
    document.addEventListener("click", (e) => {
        if (!historyDrawer.classList.contains("open")) return;
        const container = document.querySelector(".calculator-container");
        if (!container.contains(e.target)) {
            historyDrawer.classList.remove("open");
        }
    });
});

// Visual click animation for keyboard triggers
function animateButtonPress(keyVal) {
    const button = Array.from(document.querySelectorAll(".key")).find(btn => {
        return btn.getAttribute("data-key") === keyVal || 
               (keyVal === "Clear" && btn.id === "key-clear") ||
               (keyVal === "Backspace" && btn.getAttribute("aria-label") === "Backspace");
    });

    if (button) {
        button.classList.add("key-pressed");
        setTimeout(() => button.classList.remove("key-pressed"), 100);
    }
}



// History Management
function toggleHistoryDrawer(e) {
    if (e) e.stopPropagation();
    historyDrawer.classList.toggle("open");
}

function loadHistory() {
    const savedHistory = localStorage.getItem("calc_history");
    if (savedHistory) {
        history = JSON.parse(savedHistory);
        updateHistoryUI();
    }
}

function saveHistory() {
    localStorage.setItem("calc_history", JSON.stringify(history));
    updateHistoryUI();
}

function addHistoryItem(equation, result) {
    history.unshift({ equation, result });
    if (history.length > 30) {
        history.pop();
    }
    saveHistory();
}

function clearAllHistory() {
    history = [];
    saveHistory();
}

function updateHistoryUI() {
    if (history.length === 0) {
        historyList.innerHTML = '<div class="empty-history-msg">No history yet</div>';
        return;
    }

    historyList.innerHTML = history.map((item, index) => `
        <div class="history-item" data-index="${index}">
            <div class="history-item-eq">${item.equation} =</div>
            <div class="history-item-res">${item.result}</div>
        </div>
    `).join("");

    // Attach listeners to items
    const items = historyList.querySelectorAll(".history-item");
    items.forEach(item => {
        item.addEventListener("click", () => {
            const index = item.getAttribute("data-index");
            const selectedItem = history[index];
            loadFromHistory(selectedItem.result);
        });
    });
}

function loadFromHistory(value) {
    currentValue = value;
    shouldResetScreen = false;
    updateDisplay();
    historyDrawer.classList.remove("open");
}

// Calculator Logic Operations
function handleKeypadClick(e) {
    const target = e.target.closest(".key");
    if (!target) return;

    const keyVal = target.getAttribute("data-key");
    processInput(keyVal);
}

function handleKeyboardInput(e) {
    let keyVal = e.key;

    // Map keyboard inputs to calculator commands
    if (keyVal >= "0" && keyVal <= "9") {
        processInput(keyVal);
    } else if (keyVal === ".") {
        processInput(".");
    } else if (keyVal === "+") {
        processInput("+");
    } else if (keyVal === "-") {
        processInput("-");
    } else if (keyVal === "*") {
        processInput("*");
    } else if (keyVal === "/") {
        processInput("/");
    } else if (keyVal === "Enter" || keyVal === "=") {
        e.preventDefault();
        processInput("=");
    } else if (keyVal === "Backspace") {
        processInput("Backspace");
    } else if (keyVal === "Escape") {
        processInput("Clear");
    } else if (keyVal === "%") {
        processInput("%");
    }
}

function processInput(keyVal) {
    animateButtonPress(keyVal);

    if (keyVal >= "0" && keyVal <= "9") {
        appendNumber(keyVal);
    } else if (keyVal === ".") {
        appendDecimal();
    } else if (keyVal === "Clear") {
        clearAll();
    } else if (keyVal === "Backspace") {
        backspace();
    } else if (keyVal === "%") {
        applyPercentage();
    } else if (["+", "-", "*", "/"].includes(keyVal)) {
        setOperator(keyVal);
    } else if (keyVal === "=") {
        evaluate();
    }
}

function updateDisplay() {
    // Dynamic text resizing for very long inputs
    if (currentValue.length > 10) {
        displayCurrent.style.fontSize = "2.0rem";
    } else if (currentValue.length > 7) {
        displayCurrent.style.fontSize = "2.4rem";
    } else {
        displayCurrent.style.fontSize = "2.8rem";
    }

    displayCurrent.textContent = formatDisplayNumber(currentValue);

    // Format top equation preview
    if (currentOperation && previousValue) {
        displayHistory.textContent = `${formatDisplayNumber(previousValue)} ${getOpChar(currentOperation)}`;
    } else {
        displayHistory.textContent = "";
    }
}

// Prettify numbers with commas, but preserve writing decimals
function formatDisplayNumber(numStr) {
    if (numStr === "Error" || numStr === "NaN") return numStr;
    
    const parts = numStr.split(".");
    let integerPart = parts[0];
    const hasDecimal = parts.length > 1;
    const decimalPart = hasDecimal ? parts[1] : "";

    if (integerPart !== "" && !isNaN(integerPart)) {
        const value = parseFloat(integerPart);
        integerPart = value.toLocaleString("en-US", { maximumFractionDigits: 0 });
        if (numStr.startsWith("-") && !integerPart.startsWith("-")) {
            integerPart = "-" + integerPart;
        }
    }

    return hasDecimal ? `${integerPart}.${decimalPart}` : integerPart;
}

function appendNumber(num) {
    if (currentValue === "0" || shouldResetScreen || currentValue === "Error") {
        currentValue = num;
        shouldResetScreen = false;
    } else {
        if (currentValue.replace(/[^0-9]/g, "").length < 15) {
            currentValue += num;
        }
    }
    updateDisplay();
}

function appendDecimal() {
    if (shouldResetScreen) {
        currentValue = "0.";
        shouldResetScreen = false;
        updateDisplay();
        return;
    }

    if (currentValue === "Error") {
        currentValue = "0";
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }
    updateDisplay();
}

function clearAll() {
    currentValue = "0";
    previousValue = "";
    currentOperation = null;
    shouldResetScreen = false;
    updateDisplay();
}

function backspace() {
    if (shouldResetScreen || currentValue === "Error" || currentValue === "Infinity") {
        currentValue = "0";
        updateDisplay();
        return;
    }

    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
        if (currentValue === "-") {
            currentValue = "0";
        }
    } else {
        currentValue = "0";
    }
    updateDisplay();
}

function applyPercentage() {
    if (currentValue === "Error") return;
    
    const value = parseFloat(currentValue);
    if (isNaN(value)) return;
    
    currentValue = formatMathResult(value / 100);
    shouldResetScreen = true;
    updateDisplay();
}

function setOperator(op) {
    if (currentValue === "Error") return;

    if (currentOperation !== null && !shouldResetScreen) {
        evaluate();
    }
    
    previousValue = currentValue;
    currentOperation = op;
    shouldResetScreen = true;
    updateDisplay();
}

function evaluate() {
    if (currentOperation === null || shouldResetScreen) return;
    
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    let result = 0;
    
    switch (currentOperation) {
        case "+":
            result = prev + current;
            break;
        case "-":
            result = prev - current;
            break;
        case "*":
            result = prev * current;
            break;
        case "/":
            if (current === 0) {
                currentValue = "Error";
                currentOperation = null;
                previousValue = "";
                shouldResetScreen = true;
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    const equationStr = `${formatDisplayNumber(previousValue)} ${getOpChar(currentOperation)} ${formatDisplayNumber(currentValue)}`;
    const formattedResult = formatMathResult(result);
    
    addHistoryItem(equationStr, formattedResult);
    
    currentValue = formattedResult;
    currentOperation = null;
    previousValue = "";
    shouldResetScreen = true;
    updateDisplay();
}

function getOpChar(op) {
    switch (op) {
        case "+": return "+";
        case "-": return "−";
        case "*": return "×";
        case "/": return "÷";
        default: return op;
    }
}

function formatMathResult(num) {
    if (isNaN(num)) return "Error";
    if (!isFinite(num)) return "Error";
    
    const rounded = parseFloat(num.toFixed(10));
    const str = rounded.toString();
    
    if (Math.abs(rounded) > 1e15 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-10)) {
        return rounded.toExponential(7);
    }
    
    return str;
}
