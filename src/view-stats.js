import { viewBank, pluralize, viewMicroGameSummary } from './views';
import { CHARACTERS } from './gamedata';

/************ GAME HISTORY *************/
export function viewGameStats(state) {
    return `
    <div>
        <h2>Game Stats</h2>

        ${viewPlayerStats('Ian', state)}
        ${viewPlayerStats('Dave', state)}

        <hr>

        ${viewGameRecords(state)}
    </div>
    `
}

function viewGameRecords(state) {
    return `
    <div>
        <h2>Game History</h2>
        ${state.gameRecords.map(viewGameRecord).reverse().join('')}
    </div>
    `
}

function viewGameRecord(gameRecord) {
    return `
    <div class="well">
        <p>
            ${viewMicroGameSummary(gameRecord)}
        </p>
        ${viewBank(gameRecord.bank)}
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

// @todo this is calculating everybody's; it could just calc the current player
function viewOverallWinrate(playerName, state) {
    const winsByPlayer = state.gameRecords.reduce((wins, record) => {
        wins[record.winner] = (wins[record.winner] || 0) + 1; // eslint-disable-line no-param-reassign
        return wins;
    }, {});

    const winratesByPlayer = Object.keys(winsByPlayer).reduce((winr, player) => {
        const count = winsByPlayer[player];
        winr[player] = (count / state.gameRecords.length * 100).toFixed(2); // eslint-disable-line no-param-reassign
        return winr;
    }, {});

    const wins = winsByPlayer[playerName];
    const winrate = winratesByPlayer[playerName];

    return `
    <h4>Overall Winrate</h4>
    <div class="progress">
      <div class="progress-bar progress-bar-${winrateColor(winrate)}" role="progressbar" style="width: ${winrate}%;">
        ${winrate}%
        (${wins} W / ${state.gameRecords.length - wins} L)
      </div>
    </div>
    `
}

function winrateColor(winrate) {
    if (winrate > 60) return 'gold';
    if (winrate > 50) return 'success';
    if (winrate < 40) return 'danger';
    if (winrate < 50) return 'warning';
    return 'info';
}

function viewCharacterUsage(playerName, state) {
    const playerRecords = state.gameRecords
        .filter(record => record.players.some(player => player.name === playerName));
    const charUsages = CHARACTERS.map(character => {
        return {
            character,
            wins: playerRecords.reduce((count, record) => {
                const playerCharacter = record.players.find(player => player.name === playerName).character;
                return playerCharacter === character && playerName === record.winner
                    ? count + 1
                    : count
            }, 0),
            losses: playerRecords.reduce((count, record) => {
                const playerCharacter = record.players.find(player => player.name === playerName).character;
                return playerCharacter === character && playerName !== record.winner
                    ? count + 1
                    : count
            }, 0)
        }
    })

    let maxCharacterGames = 0;
    return charUsages
        .sort((a, b) => {
            const aTotal = a.wins + a.losses;
            const bTotal = b.wins + b.losses;
            if (aTotal < bTotal || (aTotal === bTotal && a.wins < b.wins)) return 1;
            if (aTotal > bTotal) return -1;
            return 0;
        })
        .map(charUsage => {
            const totalCharacterGames = charUsage.wins + charUsage.losses;
            console.log(charUsage.character, totalCharacterGames)
            if (totalCharacterGames > maxCharacterGames) maxCharacterGames = totalCharacterGames;
            return charUsage;
        })
        .map(({ character, wins, losses }) =>
            viewCharacterUsageRow(character, wins, losses, maxCharacterGames, state.gameRecords.length)
        ).join('');
}

function viewCharacterUsageRow(character, wins, losses, maxCharacterGames, totalGames) {
    console.log('max', maxCharacterGames)
    const totalCharacterGames = wins + losses;

    const winRate = (wins / maxCharacterGames * 100).toFixed(2);
    const lossRate = (losses / maxCharacterGames * 100).toFixed(2);

    if (!totalCharacterGames) return '';

    return `
    <h5>${character} <small>${totalCharacterGames} game${pluralize(totalCharacterGames)} played</small></h5>
    <div class="progress">
      <div class="progress-bar progress-bar-success" style="width: ${winRate}%">
        ${winRate}% (${wins} W)
      </div>
      <div class="progress-bar progress-bar-danger" style="width: ${lossRate}%">
        ${lossRate}% (${losses} L)
      </div>
    </div>
    `
}

