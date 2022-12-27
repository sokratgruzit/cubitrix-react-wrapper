const INIT_STATE = {
  activeExtensions: {
    trade: true,
    loan: true,
    notify: true,
    staking: true,
    referal: true,
    connect: true
  }
};

const connectReducer = (state = INIT_STATE, action) => {
  /*if (action.type === 'ACTIVA') {
    return {
      ...state,
      startGame: action.startGame,
    };
  }

  if (action.type === 'ROLL_DICE') {
    return {
      ...state,
      rolled: action.rolled,
    };
  }

  if (action.type === 'SET_DICE_NUMBER') {
    return {
      ...state,
      diceNumbers: action.diceNumbers,
    };
  }

  if (action.type === 'SET_PLAYERS_NUMBER') {
    return {
      ...state,
      players: action.players,
    };
  }

  if (action.type === 'SET_CON_PLAYERS') {
    return {
      ...state,
      connectedPlayers: action.connectedPlayers,
    };
  }

  if (action.type === 'SET_ACTIVE_PLAYER') {
    return {
      ...state,
      activePlayer: action.activePlayer,
    };
  }

  if (action.type === 'SET_SLOTS_DATA') {
    return {
      ...state,
      slotsData: action.slotsData
    }
  }

  if (action.type === 'SET_NUMBERS') {
    return {
      ...state,
      numbers: action.numbers
    }
  }

  if (action.type === 'SET_OTHERS') {
    return {
      ...state,
      otherPlayers: action.otherPlayers
    }
  }*/

  return state;
};

export default connectReducer;
