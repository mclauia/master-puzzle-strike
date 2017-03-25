import React, { Component } from 'react';

import NewGame from './game/new';
import GameSetup from './game/setup';
import CurrentGame from './game/current';

import GameStats from './stats';

export default class App extends Component {
  render() {
    return (
      <div>
        <header><h1>chips</h1></header>
        <div>
          <NewGame />

          <GameSetup />

          <CurrentGame />
        </div>

        <GameStats />
      </div>
    );
  }
}
