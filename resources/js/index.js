const header = document.querySelector('.header');
const output = document.querySelector('.output');
const input = document.querySelector('.input');
const prompt = document.querySelector('.prompt');
const commandInput = document.querySelector('.command-input');
const COMMANDS = {
    help: "These are some available commands:\nls\npwd\nwhoami\n",
    whoami: "Sai Kiran Nallagonda",
    
};

var enteredInputCommand = '';
var period = 15;
var beep = new Audio('./resources/audio/beep-sound.mp3');

var displayOutput = function (commandText) {
    if (commandText === 'clear') {
        clearOutput();
    } else {
        displayEnteredCommand(commandText);
        processEnteredCommand(commandText);
    }
    enteredInputCommand = '';
    commandInput.value = '';
}

var clearOutput = function () {
    beep.play();
    output.innerHTML = '';
};

var displayEnteredCommand = function (commandText) {
    var element = document.createElement('p');
    element.className = input.className;
    element.textContent = `$ ${commandText}`;
    output.appendChild(element);
};

var processEnteredCommand = function (commandText) {
    var element = document.createElement('p');
    if (COMMANDS[commandText]) {
        element.className = input.className;
        let outputText = COMMANDS[commandText];
        typeOutput(element, outputText);
    } else {
        element.className = 'error';
        typeOutput(element, `error : '${commandText}' command not found! See 'help' for available commands.`);
    }
};

var typeOutput = function (element, outputText) {
    let interval = setInterval(() => {
        if (outputText.length === 0) {
            clearInterval(interval);
        } else {
            element.textContent += outputText[0];
            outputText = outputText.slice(1);
            beep.play();
            output.appendChild(element);
        }
    }, period);
}

document.addEventListener("DOMContentLoaded", function () {
    header.innerHTML = 'Hi, welcome to my CLI!<br><br>';
    commandInput.focus();
});

document.body.addEventListener('click', function (event) {
    commandInput.focus();
});

commandInput.addEventListener('input', function (event) {
    enteredInputCommand = event.target.value;
});

commandInput.addEventListener("keydown", function (event) {
    if (event.key === 'Enter' && enteredInputCommand !== '') {
        displayOutput(enteredInputCommand);
    }
});