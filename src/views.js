import { RED, BLUE, PURPLE, BROWN, MULTI, GOLD } from './colors';
import { BANK, CHARACTERS } from './gamedata';

/************************************
            VIEW COMPONENTS
 ************************************/
export function viewMain(state) {
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
            ${viewNewGamePrompt()}
            ${viewSeriesPrompt(state)}
        </div>
    </div>
    `;
}

function viewSeriesPrompt(state) {
    if (!state.gameRecords.length) return '';

    const previousGameRecord = state.gameRecords[state.gameRecords.length - 1];
    const winner = previousGameRecord.players.find(player => player.name === previousGameRecord.winner);
    const loser = previousGameRecord.players.find(player => player.name !== previousGameRecord.winner);

    const seriesRecords = state.gameRecords.filter(record => record.seriesId === previousGameRecord.seriesId);
    console.log(seriesRecords);

    return `
    <p><strong>${previousGameRecord.winner}</strong> won the last time, with <strong>${winner.character}</strong>.</p>
    <p>Want to continue this series?
        (<strong>${previousGameRecord.winner}</strong> stays with <strong>${winner.character}</strong>,
        and <strong>${loser.name}</strong> may choose 1 bank swap)</p>
    <p><button type=button class="btn btn-success" onclick="App.continueSeries()">Continue Series</button></p>
    <p>${viewSeriesMiniTimeline(seriesRecords)}</p>
    `
}

function viewSeriesMiniTimeline(records) {
    const player1 = records[0].players[0];
    const player2 = records[0].players[1];

    const player1wins = records.reduce((count, record) => record.winner === player1.name ? count + 1 : count, 0);
    const player2wins = records.length - player1wins;

    const seriesLeader = player1wins > player2wins ? player1.name : player2.name;
    const leadingBy = Math.abs(player1wins - player2wins);

    return `
    <h5>Series results so far (latest to earliest):</h5>
    ${viewSeriesMiniTimelineLeader(seriesLeader, leadingBy)}
    <ul class="list-unstyled">
        ${records.reverse().map(record => {
            return `<li>
                ${viewMicroGameSummary(record)}
            </li>`
        }).join('')}
    </ul>
    `
}

export function viewMicroGameSummary(record) {
    const player1 = record.players[0];
    const player2 = record.players[1];

    return `<dl class="dl-horizontal">
        <dt>
            <span class="label label-default">${player1.character}</span>
            <span class="label label-${player1.name === record.winner ? 'success' : 'danger'}">
                ${player1.name}
            </span>
        </dt>
        <dd>
            <span class="label label-${player2.name === record.winner ? 'success' : 'danger'}">
                ${player2.name}
            </span>
            <span class="label label-default">${player2.character}</span>
        </dd>
    </dl>`
}

function viewSeriesMiniTimelineLeader(seriesLeader, leadingBy) {
    if (!leadingBy) return `<p>This series is tied.</p>`;

    return `
    <p>${seriesLeader} is leading this series by ${leadingBy} game${pluralize(leadingBy)}.</p>
    `
}

function viewNewGamePrompt() {
    return `<p><button type=button class="btn btn-success" onclick="App.setupNewGame()">New Series</button></p>`
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
    <p><button class="btn btn-default" onclick="App.declineRemoveBankStack()">Decline Swap</button></p>
    <p><ul class="list-inline">
        ${state.currentBank.map(chip =>
            `<li class="hot" onclick="App.chooseRemovedBankStack('${chip.name}')">
                <button class="btn btn-${chipClass(chip.color)}"">${chip.name} (${chip.cost})</button>
            </li>`
        ).join('')}
    </ul></p>
    `
}

function viewBankSwapReplacement(state) {
    if (!state.removedBankStack) return '';

    const restOfTheBank = BANK.filter(boxedBankChip =>
        boxedBankChip.name !== state.removedBankStack.name
        && !state.currentBank.some(prevBankChip => prevBankChip.name === boxedBankChip.name)
    );

    return `
    <h3>Remaining Bank:</h3>
    ${viewBank(state.currentBank)}
    <h3>Choose a bank stack to replace ${state.removedBankStack.name} (${state.removedBankStack.cost}):</h3>
    <p><ul class="list-inline">
        ${restOfTheBank.map(chip =>
            `<li onclick="App.chooseReplacementBankStack('${chip.name}')">
                <button class="btn btn-default btn-${chipClass(chip.color)}">${chip.name} (${chip.cost})</button>
            </li>`
        ).join('')}
    </ul></p>
    `
}

function viewCharacterSelection(state) {
    return `
        ${viewPlayerCharacterSelection(state.currentPlayers[0], state)}
        ${viewPlayerCharacterSelection(state.currentPlayers[1], state)}
    `
}

function viewPlayerCharacterSelection(player, state) {
    const otherPlayer = state.currentPlayers.find(cplayer => player.name !== cplayer.name);

    return `
    <div>
        <h3>${player.name}</h3>
        ${player.character
            ? `<p>Playing: ${player.character}</p>`
            : `<ul class="list-inline">
                ${CHARACTERS.filter(character => otherPlayer.character !== character).map(character =>
                    `<li onclick="App.pickCharacter('${player.name}', '${character}')">
                        <button type=button class="btn btn-default">
                            ${character}
                        </button>
                    </li>`
                ).join('')}
            </ul>`
        }
    </div>
`
}

function viewCharacters(state) {
    return `
        ${viewPlayerCharacter(state.currentPlayers[0])}
        ${viewPlayerCharacter(state.currentPlayers[1])}
    `
}

function viewPlayerCharacter(player) {
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
export function viewBank(bank) {
    return `<ul class="list-inline">
        ${bank.map(chip =>
            `<li><span class="label label-${chipClass(chip.color)}">${chip.name} (${chip.cost})</span></li>`
        ).join('')}
    </ul>
    `
}

export function pluralize(count) {
    return count > 1 ? 's' : ''
}

export function chipClass(color) {
    switch (color) {
        case RED:
            return 'danger'
        case BLUE:
            return 'primary'
        case PURPLE:
            return 'purple'
        case BROWN:
            return 'warning'
        case GOLD:
            return 'gold'
        case MULTI:
        default:
            return 'default';
    }
}
