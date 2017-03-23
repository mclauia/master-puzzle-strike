var App = {};

var fireStorage = firebase.storage();
var fireDatabase = firebase.database();
var fireGameRecords = fireDatabase.ref('games/');
var fireNewGameRecord = fireGameRecords.push();

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

    App.viewStats = () => {
        console.log('updating stats', state);
        const stats = document.getElementById('stats');
        const html = viewGameStats(state);
        stats.innerHTML = html;
    }

    fireGameRecords.on('value', (fireResponse) => {
        const records = fireResponse.val();
        console.log('receiving new data', records);
        state.gameRecords = Object.keys(records).map(key => records[key]);

        App.view();
        App.viewStats();
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
