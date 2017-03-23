var App = {};

var fireStorage = firebase.storage();
var fireDatabase = firebase.database();
var fireGameRecords = fireDatabase.ref('games/');
var fireNewGameRecord = fireGameRecords.push();

const RED = 'RED';
const BLUE = 'BLUE';
const PURPLE = 'PURPLE';
const BROWN = 'BROWN';
const MULTI = 'MULTI';
const GOLD = 'GOLD';

const BANK = [
    {
        name: 'Just a Scratch',
        cost: 1,
        color: RED
    },
    {
        name: 'Safe Keeping',
        cost: 1,
        color: BROWN
    },
    {
        name: 'Bang then Fizzle',
        cost: 2,
        color: BROWN
    },
    {
        name: 'Ebb or Flow',
        cost: 2,
        color: BLUE
    },
    {
        name: 'Money for Nothing',
        cost: 2,
        color: BLUE
    },
    {
        name: 'Now or Later',
        cost: 2,
        color: BROWN
    },
    {
        name: 'Repeated Jabs',
        cost: 2,
        color: RED
    },
    {
        name: 'Blues are Good',
        cost: 3,
        color: BLUE
    },
    {
        name: 'Button Mashing',
        cost: 3,
        color: BROWN
    },
    {
        name: 'Color Panic',
        cost: 3,
        color: RED
    },
    {
        name: 'One True Style',
        cost: 3,
        color: PURPLE
    },
    {
        name: 'Risk to Riskonade',
        cost: 3,
        color: BROWN
    },
    {
        name: 'Chips for Free',
        cost: 4,
        color: BROWN
    },
    {
        name: 'Hundred-Fist Frenzy',
        cost: 4,
        color: BROWN
    },
    {
        name: 'Improvisation',
        cost: 4,
        color: BLUE
    },
    {
        name: 'Ouch!',
        cost: 4,
        color: RED
    },
    {
        name: 'Pick Your Poison',
        cost: 4,
        color: RED
    },
    {
        name: 'Axe Kick',
        cost: 5,
        color: BROWN
    },
    {
        name: 'Signature Move',
        cost: 5,
        color: BROWN
    },
    {
        name: 'Punch, Punch, Kick',
        cost: 6,
        color: BROWN
    },
    {
        name: 'Option Select',
        cost: 6,
        color: MULTI
    },
    {
        name: 'X-Copy',
        cost: 6,
        color: BROWN
    },
    {
        name: 'Degenerate Trasher',
        cost: 8,
        color: BROWN
    },
    {
        name: 'The Hammer',
        cost: 12,
        color: GOLD
    },
];

const CHARACTERS = [
    'Beast Man',
    'Plague Lady',
    'Blitzcrank',
    'Rat Guy',
    'Some Kind of Priest?',
    'Rogue',
    'Crazy Bomb Dude',
    'Mistress of Pain',
    'Mr. Break You',
    'Mercy',
];

(function(App) {

    let state = {
        gameInSetup: false,
        gameInProgress: false,
        reselectBank: false,
        removedBankStack: null,
        currentBank: [],
        currentPlayers: [],
        gameRecords: []
    };

    App.setupNewGame = () => {
        state.gameInSetup = true;
        state.currentBank = getRandomBank();
        state.currentPlayers = [
            makePlayer('Ian', null),
            makePlayer('Dave', null),
        ]
        App.view();
    }

    App.pickCharacter = (playerName, character) => {
        state.currentPlayers = state.currentPlayers
            .map(player => player.name == playerName ? makePlayer(playerName, character) : player)

        if (state.currentPlayers.every(player => player.character)
            && state.currentBank.length == 10) {
            state.gameInSetup = false;
            state.gameInProgress = true;
        }

        App.view();
    }

    App.continueSeries = () => {
        state.gameInSetup = true;
        state.reselectBank = true;
        state.reselectedBank = false;

        const previousGameRecord = state.gameRecords[state.gameRecords.length - 1];
        const loserIndex = previousGameRecord.players.findIndex(player => player.name != previousGameRecord.winner);

        state.currentBank = previousGameRecord.bank;
        state.currentPlayers = previousGameRecord.players;
        state.currentPlayers[loserIndex].character = null;

        App.view();
    }

    App.chooseRemovedBankStack = (chipName) => {
        state.removedBankStack = BANK.find(chip => chip.name == chipName);

        const i = state.currentBank.findIndex(chip => chip.name == chipName);
        state.currentBank.splice(i, 1);

        App.view();
    }

    App.chooseReplacementBankStack = (chipName) => {
        state.reselectBank = false;
        state.reselectedBank = true;

        state.removedBankStack = null;
        state.currentBank.push(BANK.find(chip => chip.name == chipName));
        state.currentBank.sort((a, b) => {
            if (a.cost < b.cost) return -1;
            if (a.cost > b.cost) return 1;
            if (a.cost == b.cost) return 0;
        });

        if (state.currentPlayers.every(player => player.character)
            && state.currentBank.length == 10) {
            state.gameInSetup = false;
            state.gameInProgress = true;
        }

        App.view();
    }

    App.setWinner = (winner) => {
        state.gameInProgress = false;

        // save to db
        fireNewGameRecord.set({
            winner,
            players: state.currentPlayers,
            bank: state.currentBank
        });

        App.view();
    }

    App.view = () => {
        console.log('updating view', state);
        const main = document.getElementById('main');
        const html = viewMain(state);
        main.innerHTML = html;
    }

    fireGameRecords.on('value', (fireResponse) => {
        const records = fireResponse.val();
        console.log('receiving new data', records);
        state.gameRecords = Object.keys(records).map(key => records[key]);

        App.view();
    })

    App.view();

})(App);


/************************************
            STATE HELPERS
 ************************************/

function getRandomBank() {
    const randomNumbersBetween1and24 = new Set();

    while (randomNumbersBetween1and24.size < 10) {
        const rando = getRandomInt(0, 24);
        randomNumbersBetween1and24.add(rando);
    }

    return Array.from(randomNumbersBetween1and24)
        .sort((a, b) => {
            if (a < b) return -1;
            if (a > b) return 1;
            if (a === b) return 0;
        })
        .map((i) => BANK[i]);
}

function getRandomInt(minInc, maxExc) {
    return Math.floor(Math.random() * (maxExc - minInc)) + minInc;
}

function makePlayer(name, character) {
    return {
        name,
        character
    }
}

/************************************
            VIEW COMPONENTS
 ************************************/
function viewMain(state) {
    return `
        ${viewNewGame(state)}

        ${viewGameSetup(state)}

        ${viewCurrentGame(state)}

        ${viewGameRecords(state)}
    `
}

/************ GAME SETUP *************/
function viewGameSetup(state) {
    if (!state.gameInSetup) return '';

    return `
        <h3>Bank</h3>
        ${viewBankSwap(state)}

        ${viewCharacterSelection(state)}
    `
}

function viewPreviousGameResults(state) {
    if (!state.gameRecords.length) return '';

    const previousGameRecord = state.gameRecords[state.gameRecords.length - 1];
    const winner = previousGameRecord.players.find(player => player.name == previousGameRecord.winner);
    return `
        <div class="alert alert-info" role="alert">
            ${previousGameRecord.winner} won the last time, with ${winner.character}.
            <br>
            Want to continue this series? (winner uses same character, and chooses 1 bank swap)
            <br>
            <button type=button class="btn btn-success" onclick="App.continueSeries()">Continue Series</button>
        </div>
    `
}

function viewNewGame(state) {
    if (state.gameInSetup || state.gameInProgress) return '';
    return `
        ${viewPreviousGameResults(state)}
        ${viewNewGameButton(state)}
    `;
}

function viewNewGameButton(state) {
    return `<button type=button class="btn btn-success" onclick="App.setupNewGame()">New Game</button>`
}

function viewBankSwap(state) {
    if (!state.reselectBank) return viewBank(state.currentBank);

    return `
    <div class="well">
        ${viewBankSwapRemoval(state)}
        ${viewBankSwapReplacement(state)}
    </div>
    `
}

function viewBankSwapRemoval(state) {
    if (state.removedBankStack) return '';

    return `
    <h3>Choose a bank stack to swap out:</h3>
    <ul class="list-inline">
        ${state.currentBank.map(chip =>
            `<li class="hot" onclick="App.chooseRemovedBankStack('${chip.name}')">
                <button class="btn btn-${chipClass(chip.color)}"">${chip.name} (${chip.cost})</button>
            </li>`
        ).join('')}
    </ul>
    `
}

function viewBankSwapReplacement(state) {
    if (!state.removedBankStack) return '';

    const restOfTheBank = BANK.filter(chip =>
        chip.name != state.removedBankStack.name
        && !state.currentBank.includes(chip.name)
    )

    return `
    <h3>Remaining Bank:</h3>
    ${viewBank(state.currentBank)}
    <h3>Choose a bank stack to replace ${state.removedBankStack.name} (${state.removedBankStack.cost}):</h3>
    <ul class="list-inline">
        ${restOfTheBank.map(chip =>
            `<li class="hot" onclick="App.chooseReplacementBankStack('${chip.name}')">
                <button class="btn btn-default btn-${chipClass(chip.color)}">${chip.name} (${chip.cost})</button>
            </li>`
        ).join('')}
    </ul>
    `
}

function viewCharacterSelection(state) {
    return `
        ${viewPlayerCharacterSelection(state.currentPlayers[0], state)}
        ${viewPlayerCharacterSelection(state.currentPlayers[1], state)}
    `
}

function viewPlayerCharacterSelection(player, state) {
    const otherPlayer = state.currentPlayers.find(cplayer => player.name != cplayer.name);

    return `
    <div>
        <h3>${player.name}</h3>
        ${player.character
            ? `<p>Playing: ${player.character}</p>`
            : CHARACTERS.filter(character => otherPlayer.character != character).map(character =>
                `<button type=button class="btn btn-default" onclick="App.pickCharacter('${player.name}', '${character}')">
                    ${character}
                </button>`
            ).join('')
        }
    </div>
`
}

function viewCharacters(state) {
    return `
        ${viewPlayerCharacter(state.currentPlayers[0], state)}
        ${viewPlayerCharacter(state.currentPlayers[1], state)}
    `
}

function viewPlayerCharacter(player, state) {
    return `
    <div>
        <h3>${player.name}</h3>
        <p>Playing: ${player.character}</p>
    </div>
`
}

/************ CURRENT GAME *************/
function viewCurrentGame(state) {
    if (!state.gameInProgress) return '';

    return `
    <div>
        <h3>Bank:</h3>
        ${viewBank(state.currentBank)}

        ${viewCharacters(state)}

        <button type=button class="btn btn-success" onclick="App.setWinner('${state.currentPlayers[0].name}')">
            ${state.currentPlayers[0].name} Won
        </button>
        <button type=button class="btn btn-success" onclick="App.setWinner('${state.currentPlayers[1].name}')">
            ${state.currentPlayers[1].name} Won
        </button>
    </div>
    `
}

/************ COMMON VIEWS *************/
function viewBank(bank) {
    return `<ul class="list-inline">
        ${bank.map(chip =>
            `<li><span class="label label-${chipClass(chip.color)}">${chip.name} (${chip.cost})</span></li>`
        ).join('')}
    </ul>
    `
}

function chipClass(color) {
    switch (color) {
        case RED:
            return 'danger'
            break;
        case BLUE:
            return 'primary'
            break;
        case PURPLE:
            return 'purple'
            break;
        case BROWN:
            return 'warning'
            break;
        case MULTI:
            return 'default'
            break;
        case GOLD:
            return 'gold'
            break;
        default:
    }
}

/************ GAME HISTORY *************/
function viewGameRecords(state) {
    return `
    <div>
        <h2>Game History</h2>
        ${state.gameRecords.map(viewGameRecord).join('')}
    </div>
    `
}

function viewGameRecord(gameRecord) {
    return `
    <div class="well">
        <p>
            ${gameRecord.players[0].name} as ${gameRecord.players[0].character}
            (${gameRecord.players[0].name == gameRecord.winner ? 'W' : 'L'})
            vs
            ${gameRecord.players[1].name} as ${gameRecord.players[1].character}
            (${gameRecord.players[1].name == gameRecord.winner ? 'W' : 'L'})
        </p>
        ${viewBank(gameRecord.bank)}
    </div>
    `
}
