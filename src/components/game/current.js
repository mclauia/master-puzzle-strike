import React from 'react';
import { connect } from 'react-redux';

import { Bank } from './setup';

import { setWinner } from '../../actions';

function Characters({ currentPlayers }) {
  return (
    <div>
      <PlayerCharacter player={currentPlayers[0]} />
      <PlayerCharacter player={currentPlayers[1]} />
    </div>
  )
}

function PlayerCharacter({ player }) {
  return (
    <div>
      <h3>{player.name}</h3>
      <p>Playing: {player.character}</p>
    </div>
  )
}


function CurrentGame(props) {
  if (!props.gameInProgress) return null;

  return (
    <div>
      <h3>Bank:</h3>
      <Bank bank={props.currentBank} />

      <Characters currentPlayers={props.currentPlayers} />

      <button type="button" className="btn btn-success" onClick={() => props.setWinner(props.currentPlayers[0].name)}>
          {props.currentPlayers[0].name} Won
      </button>
      <button type="button" className="btn btn-success" onClick={() => props.setWinner(props.currentPlayers[1].name)}>
          {props.currentPlayers[1].name} Won
      </button>
    </div>
  )
}

export default connect((state) => ({
  gameInProgress: state.app.gameInProgress,
  currentBank: state.app.currentBank,
  currentPlayers: state.app.currentPlayers,
}), {
  setWinner
})(CurrentGame);
