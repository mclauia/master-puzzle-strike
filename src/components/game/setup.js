import React from 'react';
import { connect } from 'react-redux';

import { BANK, CHARACTERS } from '../../gamedata';
import { RED, BLUE, PURPLE, BROWN, MULTI, GOLD } from '../../colors';
import {
  pickCharacter,
  chooseRemovedBankStack,
  chooseReplacementBankStack,
  declineRemoveBankStack,
} from '../../actions';

export function Bank({ bank }) {
  return (
    <ul className="list-inline">
      {bank.map((chip, index) => (
        <li key={index}>
          <span className={`label label-${chipClass(chip.color)}`}>{chip.name} ({chip.cost})</span>
        </li>
      ))}
    </ul>
  )
}


function BankSwap(props) {
  if (!props.reselectBank) {
    return (
      <Bank bank={props.currentBank} />
    )
  }

  return (
    <div className="well">
      <BankSwapRemoval
        chooseRemovedBankStack={props.chooseRemovedBankStack}
        removedBankStack={props.removedBankStack}
        currentBank={props.currentBank} />
      <BankSwapReplacement
        chooseReplacementBankStack={props.chooseReplacementBankStack}
        removedBankStack={props.removedBankStack}
        currentBank={props.currentBank} />
    </div>
  )
}

function BankSwapRemoval(props) {
  if (props.removedBankStack) return null;

  return (
    <div>
      <h3>Choose a bank stack to swap out:</h3>
      <p>
        <button className="btn btn-default" onClick={props.declineRemoveBankStack}>Decline Swap</button>
      </p>
      <ul className="list-inline">
          {props.currentBank.map((chip, index) => (
            <li key={index} className="hot" onClick={() => props.chooseRemovedBankStack(chip.name)}>
              <button className={`btn btn-${chipClass(chip.color)}`}>{chip.name} ({chip.cost})</button>
            </li>
          ))}
      </ul>
    </div>
  )
}

function BankSwapReplacement(props) {
  if (!props.removedBankStack) return null;

  const restOfTheBank = BANK.filter(boxedBankChip =>
    boxedBankChip.name !== props.removedBankStack.name
    && !props.currentBank.some(prevBankChip => prevBankChip.name === boxedBankChip.name)
  );

  return (
    <div>
      <h3>Remaining Bank:</h3>
      <Bank bank={props.currentBank} />
      <h3>Choose a bank stack to replace {props.removedBankStack.name} ({props.removedBankStack.cost}):</h3>
      <p><ul className="list-inline">
        {restOfTheBank.map((chip, index) => (
          <li key={index} onClick={() => props.chooseReplacementBankStack(chip.name)}>
            <button className={`btn btn-default btn-${chipClass(chip.color)}`}>{chip.name} ({chip.cost})</button>
          </li>
        ))}
      </ul></p>
    </div>
  )
}

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

// @todo move
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
