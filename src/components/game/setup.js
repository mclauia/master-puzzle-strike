import React from 'react';
import { connect } from 'react-redux';

import { BankSwap } from '../bank';
import { CHARACTERS } from '../../config/gamedata';
import {
  pickCharacter,
  chooseRemovedBankStack,
  chooseReplacementBankStack,
  declineRemoveBankStack,
} from '../../actions';

function CharacterSelection(props) {
  return (
    <div>
      <PlayerCharacterSelection
        playerIndex={0}
        currentPlayers={props.currentPlayers}
        pickCharacter={props.pickCharacter} />
      <PlayerCharacterSelection
        playerIndex={1}
        currentPlayers={props.currentPlayers}
        pickCharacter={props.pickCharacter} />
    </div>
  )
}

function PlayerCharacterSelection(props) {
  const player = props.currentPlayers[props.playerIndex];
  const otherPlayer = props.currentPlayers[props.playerIndex === 0 ? 1 : 0];

  return (
    <div>
      <h3>{player.name}</h3>
      {player.character
        ? (
          <p>Playing: {player.character}</p>
        )
        : (
          <ul className="list-inline">
            {CHARACTERS.filter(character => otherPlayer.character !== character).map((character, index) => (
              <li key={index} onClick={() => props.pickCharacter(player.name, character)}>
                <button type="button" className="btn btn-default">
                  {character}
                </button>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  )
}

function GameSetup(props) {
  const {
    gameInSetup,
    reselectBank,
    currentBank,
    removedBankStack,
    currentPlayers,
  } = props;

  if (!gameInSetup) return null;

  return (
    <div>
      <h3>Bank</h3>
      <BankSwap
        chooseReplacementBankStack={props.chooseReplacementBankStack}
        chooseRemovedBankStack={props.chooseRemovedBankStack}
        declineRemoveBankStack={props.declineRemoveBankStack}
        reselectBank={reselectBank}
        currentBank={currentBank}
        removedBankStack={removedBankStack} />

      <CharacterSelection currentPlayers={currentPlayers} pickCharacter={props.pickCharacter}/>
    </div>
  )
}

export default connect((state) => ({
  currentBank: state.app.currentBank,
  currentPlayers: state.app.currentPlayers,
  gameInSetup: state.app.gameInSetup,
  removedBankStack: state.app.removedBankStack,
  reselectBank: state.app.reselectBank,
}), {
  pickCharacter,
  chooseRemovedBankStack,
  chooseReplacementBankStack,
  declineRemoveBankStack
})(GameSetup);
