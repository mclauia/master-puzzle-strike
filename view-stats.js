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

        ${viewPlayerStats('Ian', state)}
        ${viewPlayerStats('Dave', state)}
    </div>
    `
}

function viewPlayerStats(playerName, state) {
    return `
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">Player Stats: ${playerName}</h3>
        </div>
        <div class="panel-body">
            ${viewOverallWinrate(playerName, state)}
            <div class="well">
                <h4>Character Usage</h4>
                ${viewCharacterUsage(playerName, state)}
            </div>
        </div>
    </div>
    `
}

function viewOverallWinrate(playerName, state) {
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
    <h4>Overall Winrate</h4>
    <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: ${winratesByPlayer[playerName]}%;">
        ${winratesByPlayer[playerName]}% (${winsByPlayer[playerName]} W / ${state.gameRecords.length - winsByPlayer[playerName]} L)
      </div>
    </div>
    `
}

function viewCharacterUsage(playerName, state) {
    const playerRecords = state.gameRecords
        .filter(record => record.players.some(player => player.name == playerName));
    const charUsage = CHARACTERS.map(character => {
        return {
            character,
            wins: playerRecords.reduce((count, record) => {
                const playerCharacter = record.players.find(player => player.name == playerName).character;
                return playerCharacter == character && playerName == record.winner
                    ? count + 1
                    : count
            }, 0),
            losses: playerRecords.reduce((count, record) => {
                const playerCharacter = record.players.find(player => player.name == playerName).character;
                return playerCharacter == character && playerName != record.winner
                    ? count + 1
                    : count
            }, 0)
        }
    })

    return charUsage
        .sort((a, b) => {
            const aTotal = a.wins + a.losses;
            const bTotal = b.wins + b.losses;
            if (aTotal < bTotal || (aTotal === bTotal && a.wins < b.wins)) return 1;
            if (aTotal > bTotal) return -1;
            if (aTotal === bTotal) return 0;
        })
        .map(({ character, wins, losses }) =>
            viewCharacterUsageRow(character, wins, losses, state.gameRecords.length)
        ).join('');
}

function viewCharacterUsageRow(character, wins, losses, totalGames) {
    const winRate = (wins / totalGames * 100).toFixed(2);
    const lossRate = (losses / totalGames * 100).toFixed(2);

    if (!(wins + losses)) return '';

    return `
    <h5>${character}</h5>
    <div class="progress">
      <div class="progress-bar progress-bar-success" style="width: ${winRate}%">
        (${wins} W / ${totalGames})
      </div>
      <div class="progress-bar progress-bar-danger" style="width: ${lossRate}%">
        (${losses} L / ${totalGames})
      </div>
    </div>
    `
}



