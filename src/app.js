import { onGamesUpdate, onSeriesUpdate, pushNewGameRecord } from './firebase';
import { BANK } from './gamedata';

import { viewMain } from './views';
import { viewGameStats } from './view-stats';

const App = window.App = {};

const state = {
    gameInSetup: false,
    gameInProgress: false,
    reselectBank: false,
    seriesId: null,
    removedBankStack: null,
    currentBank: [],
    currentPlayers: [],
    gameRecords: [],
    serieses: {}
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
        .map(player => player.name === playerName ? makePlayer(playerName, character) : player)

    if (state.currentPlayers.every(player => player.character)
        && state.currentBank.length === 10
        && !state.reselectBank) {
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
    const loserIndex = previousGameRecord.players.findIndex(player => player.name !== previousGameRecord.winner);

    state.seriesId = previousGameRecord.seriesId;
    state.currentBank = previousGameRecord.bank;
    state.currentPlayers = previousGameRecord.players;
    state.currentPlayers[loserIndex].character = null;

    App.view();
}

App.declineRemoveBankStack = () => {
    state.reselectBank = false;

    if (state.currentPlayers.every(player => player.character)) {
        state.gameInSetup = false;
        state.gameInProgress = true;
    }

    App.view();
}

App.chooseRemovedBankStack = (chipName) => {
    state.removedBankStack = BANK.find(chip => chip.name === chipName);

    const i = state.currentBank.findIndex(chip => chip.name === chipName);
    state.currentBank.splice(i, 1);

    App.view();
}

App.chooseReplacementBankStack = (chipName) => {
    state.reselectBank = false;
    state.reselectedBank = true;

    state.removedBankStack = null;
    state.currentBank.push(BANK.find(chip => chip.name === chipName));
    state.currentBank.sort(ascendingCost);

    if (state.currentPlayers.every(player => player.character)
        && state.currentBank.length === 10) {
        state.gameInSetup = false;
        state.gameInProgress = true;
    }

    App.view();
}

App.setWinner = (winner) => {
    const record = {
        winner,
        players: state.currentPlayers,
        bank: state.currentBank
    };

    if (state.seriesId) {
        record.seriesId = state.seriesId;
    }

    // save to db
    pushNewGameRecord(record);

    state.gameInProgress = false;
    state.seriesId = null;

    // just clears the game view; game stats are updated on firebase listener
    App.view();
}

App.view = () => {
    console.log('updating view', state);
    const main = document.getElementById('main');
    const html = viewMain(state);
    main.innerHTML = html;
}

App.viewStats = () => {
    console.log('updating stats', state);
    const stats = document.getElementById('stats');
    const html = viewGameStats(state);
    stats.innerHTML = html;
}

onGamesUpdate(records => {
    console.log('receiving new records', records);

    if (records) {
        state.gameRecords = Object.keys(records).map(key => records[key]);
    } else {
        state.gameRecords = [];
    }

    App.view();
    App.viewStats();
})

onSeriesUpdate(serieses => {
    console.log('receiving new seriesses', serieses);
    state.serieses = serieses || {};

    App.view();
    App.viewStats();
})

App.view();


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
        .sort(ascending)
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

function ascending(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

function ascendingCost(a, b) {
    if (a.cost < b.cost) return -1;
    if (a.cost > b.cost) return 1;
    return 0;
}
