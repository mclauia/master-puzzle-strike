import { BANK } from '../config/gamedata';

const INITIAL_STATE = {
  gameInSetup: false,
  gameInProgress: false,
  reselectBank: false,
  seriesId: null,
  removedBankStack: null,
  currentBank: [],
  currentPlayers: [],
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SETUP_NEW_SERIES':
      return {
        ...state,
        gameInSetup: true,
        currentBank: getRandomBank(),
        currentPlayers: [
          makePlayer('Ian', null),
          makePlayer('Dave', null),
        ]
      };

    case 'PICK_CHARACTER': {
      const { playerName, character } = action.payload;
      const nextCurrentPlayers = state.currentPlayers
          .map(player => player.name === playerName ? makePlayer(playerName, character) : player)

      if (nextCurrentPlayers.every(player => player.character)
        && state.currentBank.length === 10
        && !state.reselectBank) {
        return {
          ...state,
          gameInSetup: false,
          gameInProgress: true,
          currentPlayers: nextCurrentPlayers
        };
      }
      return {
        ...state,
        currentPlayers: nextCurrentPlayers
      };
    }

    case 'CONTINUE_SERIES': {
      const previousGameRecord = action.payload;
      const loserIndex = previousGameRecord.players.findIndex(player => player.name !== previousGameRecord.winner);
      const nextCurrentPlayers = previousGameRecord.players;
      nextCurrentPlayers[loserIndex].character = null;

      return {
        ...state,
        gameInSetup: true,
        reselectBank: true,
        reselectedBank: false,
        seriesId: previousGameRecord.seriesId,
        currentBank: previousGameRecord.bank,
        currentPlayers: nextCurrentPlayers
      }
    }

    case 'DECLINE_REMOVE_BANK_STACK': {
      const nextState = {
        ...state,
        reselectBank: false
      };
      if (state.currentPlayers.every(player => player.character)) {
        nextState.gameInSetup = false;
        nextState.gameInProgress = true;
      }
      return nextState
    }

    case 'CHOOSE_REMOVE_BANK_STACK': {
      const chipName = action.payload;

      const nextCurrentBank = [...state.currentBank];
      const i = nextCurrentBank.findIndex(chip => chip.name === chipName);
      nextCurrentBank.splice(i, 1);

      return {
        ...state,
        currentBank: nextCurrentBank,
        removedBankStack: BANK.find(chip => chip.name === chipName)
      };
    }

    case 'CHOOSE_REPLACEMENT_BANK_STACK': {
      const chipName = action.payload;

      const nextState = {
        ...state,
        reselectBank: false,
        reselectedBank: true,
        removedBankStack: null,
        currentBank: [...state.currentBank, BANK.find(chip => chip.name === chipName)].sort(ascendingCost)
      }

      if (state.currentPlayers.every(player => player.character)
        && state.currentBank.length === 10) {
        nextState.gameInSetup = false;
        nextState.gameInProgress = true;
      }

      return nextState;
    }

    case 'GAME_ENDED': {
      return {
        ...state,
        gameInProgress: false,
        seriesId: null
      }
    }

    default:
      return state;
  }
}

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
