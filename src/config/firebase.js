/* global firebase */

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyCQInQ2oazXNOnoRuVXnrA10vYY33EDx8o',
  authDomain: 'masterpuzzlestrike.firebaseapp.com',
  databaseURL: 'https://masterpuzzlestrike.firebaseio.com',
  storageBucket: 'masterpuzzlestrike.appspot.com',
  messagingSenderId: '180796761657'
});

const DB = firebase.database();
const GAMES = 'games';
const SERIES = 'series';

const fireGames = DB.ref(`${GAMES}/`);
const fireSeries = DB.ref(`${SERIES}/`);

export function pushNewGameRecord(record) {
  const next = fireGames.push();
  const recordId = next.key;
  console.log(recordId);
  const seriesId = record.seriesId
        ? addGameToSeries(record.seriesId, recordId)
        : pushNewSeries(recordId);

  next.set({
    id: recordId,
    seriesId,
    ...record
  });
}

export function onGamesUpdate(updateFn) {
  fireGames.on('value', (fireResponse) => {
    const records = fireResponse.val();

    updateFn(records);
  })
}

export function onSeriesUpdate(updateFn) {
  fireSeries.on('value', (fireResponse) => {
    const serieses = fireResponse.val();

    updateFn(serieses);
  })
}

function pushNewSeries(recordId) {
  const next = fireSeries.push();

  addGameToSeries(next.key, recordId);

  return next.key;
}

function addGameToSeries(seriesId, recordId) {
  const fireSeriesGames = DB.ref(`${SERIES}/${seriesId}/${GAMES}/`);
  const next = fireSeriesGames.push();
  next.set(recordId);

  return seriesId;
}
