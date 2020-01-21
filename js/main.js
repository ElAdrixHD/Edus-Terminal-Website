var terminal = new Terminal();
var FILE_LIST = [
    ".",
    "..",
    "header",
    "motd",
    "about-me",
    "about-the-page",
    "socials",
    "contact"
];


async function loadTerm() {
    document.getElementById("terminal").append(terminal.html);
    terminal.setPrompt("Guest@edufdez-es:~$ ");

    await printHeader();
    await printMOTD();

    showPrompt();
}

/**
 * Commands available and function each one calls
 * @param {String} command 
 */
async function commands(command) {
    firstWord = trimSpaces(command).split(' ')[0];

    switch (firstWord) {
        case "help":
            await printHelp();
            break;

        case "clear":
            await doClear();
            break;

        case "ls":
            await printFileList();
            break;

        case "cat":
            await printCat(command);
            break;

        case "sudo":
            printSudo(command);
            break;

        case "touch":
            await print("don't touch that!");
            break;

        case "cd":
            await print("no, you can't change the current directory in here.");
            break;

        case "":
            await print("");
            break;

        default:
            await print(command + ": command not found, type 'help' to see a list of commands.");
            break;
    }
}

//#region command functions

async function printHeader() {
    await loadText('txt/header.html', print);
    terminal.println();

    return;
}

async function printMOTD() {
    await loadText('txt/motd.html', print);
    terminal.println();

    return;
}

async function printHelp() {
    terminal.println();
    await loadText('txt/help.html', print);
    terminal.println();

    return;
}

async function doClear() {
    terminal.clear();
    await printHeader();

    return;
}

async function printFileList() {
    FILE_LIST.sort();

    terminal.println();
    await print(FILE_LIST);
    terminal.println();

    return;
}

async function printCat(command) {
    words = trimSpaces(command).split(' ');

    if (words.length > 2) {
        await print("Too many arguments");
    } else {
        if (words[1] == "." || words[1] == "..") {
            print("You don't have permisions.");
        } else if (FILE_LIST.findIndex((element) => element == words[1]) != -1) {
            terminal.println();
            await loadText('txt/' + words[1] + '.html', print);
            terminal.println();
        } else {
            await print("cat: " + words[1] + ": No such file or directory");
        }
    }

    return;
}

async function printSudo(command) {
    words = trimSpaces(command).split(' ');
    switch (words[1]) {
        case "touch":
            await print("you touched that");
            break;

        case "cat":
            if (words[2] == "." || words[2] == "..") {
                print("What are you trying? This is not a real shell, there's nothing in there.");
            } else {
                var a = words[1] + " " + words[2];
                printCat(a);
            }
            break;

        default:
            await print("you have now super cow powers");
            break;
    }
}

//#endregion
//#region utils functions

async function showPrompt() {
    await terminal.input(async function (res) {
        await commands(res);
        showPrompt();
    });

    return;
}

async function print(text) {
    var lines;
    if (Array.isArray(text)) {
        lines = text;
    } else {
        lines = text.split('\n');
    }

    for (var i = 0; i < lines.length; i++) {
        terminal.printHTML(lines[i]);
        await sleep(25);
    }

    return;
}

async function loadText(url, callback) {
    await fetch(url)
        .then(res => { return res.text(); })
        .then(res => callback(res));

    return;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function trimSpaces(text) {
    return text.replace(/\s+/g, ' ').trim();
}
//#endregion