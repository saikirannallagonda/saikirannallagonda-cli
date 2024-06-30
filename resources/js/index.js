"use strict";

const header = document.querySelector('.header');
const output = document.querySelector('.output');
const input = document.querySelector('.input');
const prompt = document.querySelector('.prompt');
const commandInput = document.querySelector('.command-input');
const commands = [
    {
        name: "whoami",
        usage: "Display name.",
        result: "Sai Kiran Nallagonda",
    },
    {
        name: "showdp",
        usage: "Display profile picture.",
        result: "./resources/images/dp.jpg",
        isImage: true,
    },
    {
        name: "edu",
        usage: "Display Education.",
        result: "Graduated in EEE\'18 from GRIET, Hyderabad."
    },
    {
        name: "links",
        usage: "View links",
        links: new Map([
            ["X (Twitter)", "https://x.com/SaiKNallagonda"],
            ["YouTube", "https://www.youtube.com/@sai_kiran_n"],
        ]),
        areLinks: true,
    },
    {
        name: "clear",
        usage: "Clear the CLI.",
    },
];

var enteredInputCommand = '';
var typePeriod = 15;
var linePeriod = 150;
var beep = new Audio('./resources/audio/beep-sound.mp3');
var commandsUsed = ['help'];
var commandIndex = 0;

const focusInput = function () {
    input.scrollIntoView({ behavior: "smooth", block: "end" });
};
const outputObserver = new MutationObserver(focusInput);
outputObserver.observe(output, { childList: true, subtree: true, attributes: true, characterData: true, });

var displayOutput = function (commandText) {
    commandText = commandText.trim();
    if (commandText === 'clear') {
        clearOutput();
    } else {
        displayEnteredCommand(commandText);
        processEnteredCommand(commandText);
    }
    enteredInputCommand = '';
    commandInput.value = '';
};

var clearOutput = function () {
    beep.play();
    output.innerHTML = '';
};

var displayEnteredCommand = function (commandText) {
    var element = document.createElement('p');
    element.className = input.className;
    element.innerHTML = `$&nbsp${commandText}`;
    output.appendChild(element);
};

var processEnteredCommand = function (commandText) {
    var element = document.createElement('p');
    let command = commands.find(command => command.name === commandText);
    if (command) {
        if (command.isImage) {
            element = document.createElement('img');
            element.src = command.result;
            beep.play();
            output.appendChild(element);
        } else if (command.areLinks) {
            displayLinks(command.links);
        } else {
            element.className = input.className;
            let outputText = command.result;
            typeOutput(element, outputText);
        }
    } else if (commandText === 'help') {
        element.className = input.className;
        displayCommands(element);
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
    }, typePeriod);
};

var displayLinks = function (links) {
    let keys = links.keys();
    let list = document.createElement('ul');
    let interval = setInterval(() => {
        let next = keys.next();
        if (next.done) {
            clearInterval(interval);
        } else {
            let key = next.value;
            let value = links.get(key);
            let link = document.createElement('li');
            link.innerHTML = `<p>${key}</p>&nbsp;&nbsp;&nbsp;<a href=${value} target='_blank'>${value}</a>`;
            beep.play();
            list.appendChild(link);
        }
    }, linePeriod);
    output.appendChild(list);
};

var displayCommands = function (element) {
    element.innerHTML = "&nbsp;&nbsp;&nbsp;command : usage<br/>"
    let index = 0;
    let interval = setInterval(() => {
        if (index === commands.length) {
            clearInterval(interval);
        } else {
            let command = commands[index];
            element.innerHTML += `<br/>&nbsp;&nbsp;&nbsp;${command.name} : ${command.usage}`;
            beep.play();
            index++;
        }
    }, linePeriod);
    output.appendChild(element);
};

var updateCommandInput = function (value) {
    commandInput.value = value;
    let inputEvent = new Event('input', { bubbles: true });
    commandInput.dispatchEvent(inputEvent);
    commandInput.focus();
};

document.addEventListener("DOMContentLoaded", function () {
    header.innerHTML = 'Hi, welcome to my CLI!<br><br>See \'help\' for available commands.';
    commandInput.focus();
});

document.body.addEventListener('click', function (event) {
    commandInput.focus();
});

commandInput.addEventListener('input', function (event) {
    enteredInputCommand = event.target.value;
});

commandInput.addEventListener("keydown", function (event) {
    if ((event.key === 'Enter' || event.keyCode === 13) && enteredInputCommand !== '') {
        commandsUsed.pop();
        commandsUsed.push(enteredInputCommand);
        commandsUsed.push('');
        displayOutput(enteredInputCommand);
        commandIndex = commandsUsed.length - 1;
    } else if ((event.key === 'ArrowDown' || event.keyCode === 40)) {
        if (commandIndex >= commandsUsed.length - 1) {
            commandIndex = commandsUsed.length - 1;
            updateCommandInput(commandsUsed[commandIndex]);
        } else if (commandIndex < commandsUsed.length) {
            updateCommandInput(commandsUsed[++commandIndex]);
        }
    } else if ((event.key === 'ArrowUp' || event.keyCode === 38)) {
        if (commandIndex <= 0) {
            commandIndex = 0;
            updateCommandInput(commandsUsed[commandIndex]);
        } else if (commandIndex > 0) {
            updateCommandInput(commandsUsed[--commandIndex]);
        }
    }
});