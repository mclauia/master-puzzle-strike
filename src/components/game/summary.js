import React from 'react';

export function MicroGameSummary(props) {
  const { record } = props;
  const player1 = record.players[0];
  const player2 = record.players[1];

  return (
    <dl className="dl-horizontal">
      <dt>
          <span className="label label-default">{player1.character}</span>
          <span className={`label label-${player1.name === record.winner ? 'success' : 'danger'}`}>
              {player1.name}
          </span>
      </dt>
      <dd>
          <span className={`label label-${player2.name === record.winner ? 'success' : 'danger'}`}>
              {player2.name}
          </span>
          <span className="label label-default">{player2.character}</span>
      </dd>
    </dl>
  )
}
