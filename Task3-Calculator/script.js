let currentInput = "0";
let shouldResetDisplay = false;

const display = document.getElementById("display");

function updateDisplay() {
    display.innerText = currentInput;
}

function appendNumber(number) {
    // If an operation just finished or display is 0, overwrite it
    if (currentInput === "0" || shouldResetDisplay) {
        if (number === ".") {
            currentInput = "0.";
        } else {
            currentInput = number;
        }
        shouldResetDisplay = false;
    } else {
        // Prevent adding multiple decimal points in a single number string
        if (number === "." && currentInput.split(/[\+\-\*\/]/).pop().includes(".")) {
            return;
        }
        currentInput += number;
    }
    updateDisplay();
}

function appendOperator(operator) {
    if (shouldResetDisplay) shouldResetDisplay = false;

    // Grab the last character to ensure we don't chain double operators
    const lastChar = currentInput.slice(-1);

    // Allow % as a postfix operator (e.g., 50%)
    if (operator === "%") {
        // Avoid applying % to an empty/initial state like just "0" + "%" -> still fine.
        currentInput += "%";
        updateDisplay();
        return;
    }

    if (["+", "-", "*", "/"].includes(lastChar)) {
        // Replace old operator with the new one
        currentInput = currentInput.slice(0, -1) + operator;
    } else {
        currentInput += operator;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = "0";
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = "0";
    }
    updateDisplay();
}

function calculate() {
    const lastChar = currentInput.slice(-1);

    // If the expression ends with an operator, strip it away before processing
    if (["+", "-", "*", "/"].includes(lastChar)) {
        currentInput = currentInput.slice(0, -1);
    }

    // Convert trailing % into /100 before evaluation
    if (currentInput.endsWith("%")) {
        currentInput = currentInput.slice(0, -1) + "/100";
    }

    try {
        // Using Function construction instead of raw eval for safer code parsing
        let result = new Function(`return ${currentInput}`)();

        // Handle floating point precision errors (like 0.1 + 0.2)
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(8));
        }

        currentInput = String(result);
        shouldResetDisplay = true;
    } catch (error) {
        currentInput = "Error";
        shouldResetDisplay = true;
    }

    updateDisplay();
}
