// Select DOM elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const percentButton = document.querySelector('[data-action="percent"]');

// State variables
let currentOperand = '';
let previousOperand = '';
let operation = undefined;
let isError = false;

/**
 * Reset the calculator state
 */
function clearCalculator() {
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
    isError = false;
}

/**
 * Delete the last entered character
 */
function deleteLast() {
    if (isError) {
        clearCalculator();
        return;
    }
    currentOperand = currentOperand.toString().slice(0, -1);
}

/**
 * Append a number or decimal point
 */
function appendNumber(number) {
    if (isError) clearCalculator();
    
    // Prevent multiple decimals
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Prevent multiple leading zeros
    if (number === '0' && currentOperand === '0') return;
    
    // If current is just '0' and we type a number (not decimal), replace it
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number.toString();
        return;
    }
    
    currentOperand = currentOperand.toString() + number.toString();
}

/**
 * Select an operator
 */
function chooseOperator(operator) {
    if (isError) clearCalculator();
    if (currentOperand === '' && previousOperand === '') return;
    
    // Allow changing the operator if no new number is entered
    if (currentOperand === '') {
        operation = operator;
        return;
    }
    
    // Calculate if we already have a pending operation
    if (previousOperand !== '') {
        calculate();
    }
    
    operation = operator;
    previousOperand = currentOperand;
    currentOperand = '';
}

/**
 * Perform the calculation
 */
function calculate() {
    if (isError) return;
    
    let result;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    // If incomplete expression, do nothing
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '−': // Displayed minus
        case '-': // Keyboard minus
            result = prev - current;
            break;
        case '×': // Displayed multiply
        case '*': // Keyboard multiply
            result = prev * current;
            break;
        case '÷': // Displayed divide
        case '/': // Keyboard divide
            if (current === 0) {
                isError = true;
                currentOperand = 'Cannot divide by zero';
                previousOperand = '';
                operation = undefined;
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Handle floating point precision issues simply
    currentOperand = Math.round(result * 100000000) / 100000000;
    operation = undefined;
    previousOperand = '';
}

/**
 * Apply percentage to the current operand
 */
function applyPercentage() {
    if (isError || currentOperand === '') return;
    
    const current = parseFloat(currentOperand);
    if (isNaN(current)) return;
    
    currentOperand = (current / 100).toString();
}

/**
 * Format numbers with commas for better readability
 */
function getDisplayNumber(number) {
    if (isError && number === 'Cannot divide by zero') return number;
    if (isError && number === 'Error') return number;
    if (number === '') return '';
    if (number === '-') return '-';
    
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    
    let integerDisplay;
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

/**
 * Update the UI display
 */
function updateDisplay() {
    if (isError) {
        currentOperandElement.innerText = currentOperand;
        previousOperandElement.innerText = '';
        return;
    }
    
    // Show '0' if current operand is empty and no previous operation exists
    if (currentOperand === '' && previousOperand === '') {
        currentOperandElement.innerText = '0';
    } else if (currentOperand === '' && operation != null) {
        // Keeps the display from being empty when typing the second number
        currentOperandElement.innerText = '';
    } else {
        currentOperandElement.innerText = getDisplayNumber(currentOperand);
    }
    
    if (operation != null) {
        previousOperandElement.innerText = `${getDisplayNumber(previousOperand)} ${operation}`;
    } else {
        previousOperandElement.innerText = '';
    }
}

// Event Listeners for Clicks
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.getAttribute('data-number'));
        updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperator(button.getAttribute('data-operator'));
        updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculate();
    updateDisplay();
});

clearButton.addEventListener('click', () => {
    clearCalculator();
    updateDisplay();
});

deleteButton.addEventListener('click', () => {
    deleteLast();
    updateDisplay();
});

percentButton.addEventListener('click', () => {
    applyPercentage();
    updateDisplay();
});

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) {
        appendNumber(e.key);
        updateDisplay();
    }
    if (e.key === '.') {
        appendNumber(e.key);
        updateDisplay();
    }
    if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault(); // Prevent enter from clicking focused buttons
        calculate();
        updateDisplay();
    }
    if (e.key === 'Backspace') {
        deleteLast();
        updateDisplay();
    }
    if (e.key === 'Escape') {
        clearCalculator();
        updateDisplay();
    }
    if (e.key === '+' || e.key === '-') {
        chooseOperator(e.key);
        updateDisplay();
    }
    if (e.key === '*') {
        chooseOperator('×');
        updateDisplay();
    }
    if (e.key === '/') {
        e.preventDefault(); // Prevent quick search in browsers
        chooseOperator('÷');
        updateDisplay();
    }
    if (e.key === '%') {
        applyPercentage();
        updateDisplay();
    }
});
