import { createSelector } from 'reselect';

const INITIAL_STATE = {
  gameRecords: [],
  serieses: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'NEW_RECORDS':
      return {
        ...state,
        gameRecords: action.payload
      };

    case 'NEW_SERIESES':
      const serieses = action.payload;

      return {
        ...state,
        serieses
      };

    default:
      return state;
  }
}

export const getGameRecordsList = createSelector(
  (state) => state.stats.gameRecords,
  (records) => records ? Object.values(records) : []
)
