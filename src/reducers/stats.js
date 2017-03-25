const INITIAL_STATE = {
  gameRecords: [],
  serieses: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'NEW_RECORDS':
      const records = action.payload;

      return {
        ...state,
        gameRecords: records ? Object.keys(records).map(key => records[key]) : []
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
