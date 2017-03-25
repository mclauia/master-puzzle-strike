import { pushNewGameRecord } from './config/firebase';

export function newRecords(records) {
  return {
    type: 'NEW_RECORDS',
    payload: records
  }
}

export function newSerieses(serieses) {
  return {
    type: 'NEW_SERIESES',
    payload: serieses
  }
}

export function setupNewSeries() {
  return {
    type: 'SETUP_NEW_SERIES'
  }
}

export function continueSeries() {
  return (dispatch, getState) => {
    const state = getState();

    const previousRecord = state.stats.gameRecords[Object.keys(state.stats.gameRecords).pop()];

    dispatch({
      type: 'CONTINUE_SERIES',
      payload: previousRecord
    })
  }
}

export function pickCharacter(playerName, character) {
  return {
    type: 'PICK_CHARACTER',
    payload: {
      playerName,
      character
    }
  }
}

export function chooseRemovedBankStack(chip) {
  return {
    type: 'CHOOSE_REMOVE_BANK_STACK',
    payload: chip
  }
}

export function chooseReplacementBankStack(chip) {
  return {
    type: 'CHOOSE_REPLACEMENT_BANK_STACK',
    payload: chip
  }
}

export function declineRemoveBankStack() {
  return {
    type: 'DECLINE_REMOVE_BANK_STACK'
  }
}

export function gameEnded() {
  return {
    type: 'GAME_ENDED'
  }
}


export function setWinner(winner) {
  return (dispatch, getState) => {
    const state = getState();
    const record = {
      winner,
      players: state.app.currentPlayers, // @todo fix the app nesting
      bank: state.app.currentBank
    };

    if (state.app.seriesId) {
      record.seriesId = state.app.seriesId;
    }

    //   // save to db
    pushNewGameRecord(record);

    dispatch(gameEnded());
  }
}
