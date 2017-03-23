/************************************
            VIEW COMPONENTS
 ************************************/
function viewMain(state) {
    return `
        ${viewNewGame(state)}

        ${viewGameSetup(state)}

        ${viewCurrentGame(state)}
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

function viewNewGame(state) {
    if (state.gameInSetup || state.gameInProgress) return '';

    return `
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">Set Up a New Game</h3>
        </div>
        <div class="panel-body">
            ${viewSeriesPrompt(state)}
            ${viewNewGamePrompt(state)}
        </div>
    </div>
    `;
}

function viewSeriesPrompt(state) {
    if (!state.gameRecords.length) return '';

    const previousGameRecord = state.gameRecords[state.gameRecords.length - 1];
    const winner = previousGameRecord.players.find(player => player.name == previousGameRecord.winner);
    return `
        ${previousGameRecord.winner} won the last time, with ${winner.character}.
        <br>
        Want to continue this series? (winner uses same character, and chooses 1 bank swap)
        <br>
        <button type=button class="btn btn-success" onclick="App.continueSeries()">Continue Series</button>
    `
}

function viewNewGamePrompt(state) {
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

    const restOfTheBank = BANK.filter(boxedBankChip =>
        boxedBankChip.name != state.removedBankStack.name
        && !state.currentBank.some(prevBankChip => prevBankChip.name == boxedBankChip.name)
    );

    console.log(restOfTheBank);

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
