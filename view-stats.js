/************ GAME HISTORY *************/
function viewGameRecords(state) {
    return `
    <div>
        <h2>Game History</h2>
        ${state.gameRecords.map(viewGameRecord).join('')}
    </div>
    `
}

function viewGameRecord(gameRecord) {
    return `
    <div class="well">
        <p>
            ${gameRecord.players[0].name} as ${gameRecord.players[0].character}
            (${gameRecord.players[0].name == gameRecord.winner ? 'W' : 'L'})
            vs
            ${gameRecord.players[1].name} as ${gameRecord.players[1].character}
            (${gameRecord.players[1].name == gameRecord.winner ? 'W' : 'L'})
        </p>
        ${viewBank(gameRecord.bank)}
    </div>
    `
}

function viewGameStats(state) {
    return `
    <div>
        <h2>Game Stats</h2>

        ${viewWinrates('Ian', state)}
        ${viewCharacterUsage('Ian', state)}
    </div>
    `
}

function viewWinrates(playerName, state) {
    const winsByPlayer = state.gameRecords.reduce((wins, record) => {
        wins[record.winner] = (wins[record.winner] || 0) + 1;
        return wins;
    }, {});

    const winratesByPlayer = Object.keys(winsByPlayer).reduce((winr, player) => {
        const count = winsByPlayer[player];
        winr[player] = (count / state.gameRecords.length * 100).toFixed(2);
        return winr;
    }, {})

    return `
    <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: ${winratesByPlayer[playerName]}%;">
        ${winratesByPlayer[playerName]}% (${winsByPlayer[playerName]} W / ${state.gameRecords.length - winsByPlayer[playerName]} L)
      </div>
    </div>
    `
}

function viewCharacterUsage(playerName, state) {
    const charUsageByPlayer = state.gameRecords.reduce((charUsage, record) => {
        const { players } = record;
        charUsage[playerName] = charUsage[playerName] || {};

        const { character } = players.find(player => player.name == playerName);
        charUsage[playerName][character] = (charUsage[playerName][character] || 0) + 1;

        return charUsage;
    }, {});

    console.log(charUsageByPlayer);

    return Object.keys(charUsageByPlayer[playerName]).map(character => {
        const usageCountByCharacter = charUsageByPlayer[playerName][character]

        return viewCharacterUsageRow(character, usageCountByCharacter, state.gameRecords.length);
    }).join('')

}

function viewCharacterUsageRow(character, usage, totalGames) {
    const usageRate = (usage / totalGames * 100).toFixed(2);

     //       <div class="progress-bar progress-bar-success" style="width: 35%">
     //   </div>
     //   <div class="progress-bar progress-bar-danger" style="width: 10%">
     //   </div>

    return `
    <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: ${usageRate}%;">
        ${character} (${usage} / ${totalGames})
      </div>
    </div>
    `
}



