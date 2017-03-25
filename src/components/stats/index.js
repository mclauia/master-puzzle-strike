import React from 'react';
import { connect } from 'react-redux';

// @todo commonize these locations
import { Bank } from '../bank';
import { pluralize } from '../common';
import { MicroGameSummary } from '../game/summary';

import { CHARACTERS } from '../../config/gamedata';

/************ GAME HISTORY *************/
function GameStats({ gameRecords }) {
  return (
    <div>
      <h2>Game Stats</h2>

      <PlayerStats playerName="Ian" records={gameRecords} />
      <PlayerStats playerName="Dave" records={gameRecords} />

      <hr />

      <GameRecords records={gameRecords}/>
    </div>
  )
}

function GameRecords({ records }) {
  return (
    <div>
        <h2>Game History</h2>
        {records.map((record, index) => (
          <GameRecord key={index} record={record} />
        )).reverse()}
    </div>
  )
}

function GameRecord({ record }) {
  return (
    <div className="well">
      <div>
          <MicroGameSummary record={record} />
      </div>
      <Bank bank={record.bank} />
    </div>
  )
}

function PlayerStats({ playerName, records }) {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
          <h3 className="panel-title">Player Stats: {playerName}</h3>
      </div>
      <div className="panel-body">
        <OverallWinrate playerName={playerName} records={records} />
        <div className="well">
          <h4>Character Usage</h4>
          <CharacterUsage playerName={playerName} records={records} />
        </div>
      </div>
    </div>
  )
}

function OverallWinrate({ playerName, records }) {
  const wins = records.filter(record => record.winner === playerName).length
  const winRate = (wins / records.length * 100).toFixed(2);

  return (
    <div>
      <h4>Overall Winrate</h4>
      <div className="progress">
        <div className={
          `progress-bar progress-bar-${winRateColor(winRate)}`
        } role="progressbar" style={{ width: `${winRate}%` }}>
          {`${winRate}%`}
          {`(${wins} W / ${records.length - wins} L)`}
        </div>
      </div>
    </div>
  )
}

function winRateColor(winRate) {
  if (winRate > 60) return 'gold';
  if (winRate > 50) return 'success';
  if (winRate < 40) return 'danger';
  if (winRate < 50) return 'warning';
  return 'info';
}

function CharacterUsage({ playerName, records }) {
  const playerRecords = records
        .filter(record => record.players.some(player => player.name === playerName));
  let maxCharacterGames = 0;

  const charUsages = CHARACTERS
    .map(character => ({
      character,
      wins: playerRecords.reduce(
        (count, record) => wasWinnerAsCharacter(playerName, character, record) ? count + 1 : count,
        0
      ),
      losses: playerRecords.reduce(
        (count, record) => wasLoserAsCharacter(playerName, character, record) ? count + 1 : count,
        0
      )
    }))
    .sort((a, b) => {
      const aTotal = a.wins + a.losses;
      const bTotal = b.wins + b.losses;
      if (aTotal < bTotal || (aTotal === bTotal && a.wins < b.wins)) return 1;
      if (aTotal > bTotal) return -1;
      return 0;
    })
    .map(charUsage => {
      const totalCharacterGames = charUsage.wins + charUsage.losses;
      if (totalCharacterGames > maxCharacterGames) maxCharacterGames = totalCharacterGames;
      return charUsage;
    });

  return (
    <div>
      {charUsages.map(({ character, wins, losses }, index) => (
        <CharacterUsageRow
          key={index}
          character={character}
          wins={wins}
          losses={losses}
          maxCharacterGames={maxCharacterGames} />
      ))}
    </div>
  )
}

function wasWinnerAsCharacter(playerName, character, record) {
  const playerCharacter = record.players.find(player => player.name === playerName).character;
  return playerCharacter === character && playerName === record.winner
}

function wasLoserAsCharacter(playerName, character, record) {
  const playerCharacter = record.players.find(player => player.name === playerName).character;
  return playerCharacter === character && playerName !== record.winner
}

function CharacterUsageRow({ character, wins, losses, maxCharacterGames }) {
  const totalCharacterGames = wins + losses;

  const winRate = wins ? (wins / maxCharacterGames * 100).toFixed(2) : 0;
  const lossRate = losses ? (losses / maxCharacterGames * 100).toFixed(2) : 0;

  if (!totalCharacterGames) return null;

  return (
    <div>
      <h5>{character} <small>{totalCharacterGames} game{pluralize(totalCharacterGames)} played</small></h5>
      <div className="progress">
        <div className="progress-bar progress-bar-success" role="progressbar" style={{ width: `${winRate}%` }}>
          {winRate > 0 ? `${winRate}% (${wins} W)` : null}
        </div>
        <div className="progress-bar progress-bar-danger" role="progressbar" style={{ width: `${lossRate}%` }}>
          {lossRate > 0 ? `${lossRate}% (${losses} L)` : null}
        </div>
      </div>
    </div>
  )
}

export default connect((state) => ({
  gameRecords: state.stats.gameRecords
}), {})(GameStats);
