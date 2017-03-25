import React from 'react';

import { BANK } from '../gamedata';

import { chipClass } from './common';

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

export function BankSwap(props) {
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

export function BankSwapRemoval(props) {
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

export function BankSwapReplacement(props) {
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

