import React from 'react';
import { connect } from 'react-redux';

import { getGameRecordsList } from '../../reducers/stats';

import { MicroGameSummary } from './summary';
import { pluralize } from '../common';
import { setupNewSeries, continueSeries } from '../../actions';

function NewSeriesPrompt(props) {
  return (
    <p>
      <button
        type="button"
        className="btn btn-success"
        onClick={props.setupNewSeries}>
        New Series
      </button>
    </p>
  )
}

function ContinueSeriesPrompt(props) {
  if (!props.gameRecordsList.length) return null;

  const previousGameRecord = props.gameRecordsList[props.gameRecordsList.length - 1];
  const winner = previousGameRecord.players.find(player => player.name === previousGameRecord.winner);
  const loser = previousGameRecord.players.find(player => player.name !== previousGameRecord.winner);

  const seriesRecords = props.gameRecordsList.filter(record => record.seriesId === previousGameRecord.seriesId);

  return (
    <div>
      <p>
        <strong>{previousGameRecord.winner}</strong>
        {' won the last time, with '}
        <strong>{winner.character}</strong>
      </p>
      <p>
        {' Want to continue this series? ('}
        <strong>{previousGameRecord.winner}</strong>
        {' stays with '}
        <strong>{winner.character}</strong>
        {', and '}
        <strong>{loser.name}</strong>
        {' may choose 1 bank swap)'}
      </p>
      <p>
        <button type="button" className="btn btn-success" onClick={props.continueSeries}>
          Continue Series
        </button>
      </p>
      <SeriesMiniTimeline records={seriesRecords} />
    </div>
  )
}

function SeriesMiniTimeline(props) {
  const { records } = props;
  const player1 = records[0].players[0];
  const player2 = records[0].players[1];

  const player1wins = records.reduce((count, record) => record.winner === player1.name ? count + 1 : count, 0);
  const player2wins = records.length - player1wins;

  const seriesLeader = player1wins > player2wins ? player1.name : player2.name;
  const leadingBy = Math.abs(player1wins - player2wins);

  return (
    <div>
      <h5>Series results so far (latest to earliest):</h5>
      <SeriesMiniTimelineLeader seriesLeader={seriesLeader} leadingBy={leadingBy} />
      <ul className="list-unstyled">
          {records.reverse().map((record, index) => (
            <li key={index}>
              <MicroGameSummary record={record} />
            </li>
          ))}
      </ul>
    </div>
  )
}

function SeriesMiniTimelineLeader(props) {
  const { seriesLeader, leadingBy } = props;
  if (!leadingBy) {
    return (
      <p>This series is tied.</p>
    );
  }

  return (
    <p>{seriesLeader} is leading this series by {leadingBy} game{pluralize(leadingBy)}.</p>
  );
}


function NewGame(props) {
  if (props.gameInSetup || props.gameInProgress) return null;
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
          <h3 className="panel-title">Set Up a New Game</h3>
      </div>
      <div className="panel-body">
        <NewSeriesPrompt setupNewSeries={props.setupNewSeries} />
        <ContinueSeriesPrompt gameRecordsList={props.gameRecordsList} continueSeries={props.continueSeries}/>
      </div>
    </div>
  );
}

export default connect((state) => ({
  gameRecordsList: getGameRecordsList(state),
  gameInSetup: state.app.gameInSetup,
  gameInProgress: state.app.gameInProgress,
}), {
  setupNewSeries,
  continueSeries
})(NewGame);
