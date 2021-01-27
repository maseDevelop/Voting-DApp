import {
  SET_WEB3_INSTANCE,
  SET_ACCOUNTS_INSTANCE,
  SET_CONTRACT_INSTANCE,
  STORE_CHARACTER_DATA,
  STORE_CHARACTER_SEARCH_RESULTS,
  SET_ACCOUNT_VOTED,
  SET_TOP_CHARACTERS,
  SET_IS_LOADING,
} from "../Constants";

const initialSetUpState = {
  web3: null,
  accounts: null,
  contract: null,
  isLoading: true,
};

export const setUpReducer = (state = initialSetUpState, action = {}) => {
  switch (action.type) {
    case SET_WEB3_INSTANCE:
      return { ...state, web3: action.payload };

    case SET_ACCOUNTS_INSTANCE:
      return { ...state, accounts: action.payload };

    case SET_CONTRACT_INSTANCE:
      return { ...state, contract: action.payload };

    case SET_IS_LOADING:
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
};

const initialStateCharacterData = {
  characterData: {},
  characterSearchResults: [],
};

export const characterDataReducer = (
  state = initialStateCharacterData,
  action = {}
) => {
  switch (action.type) {
    case STORE_CHARACTER_DATA:
      return { ...state, characterData: action.payload };

    case STORE_CHARACTER_SEARCH_RESULTS:
      return { ...state, characterSearchResults: [...action.payload] };

    default:
      return state;
  }
};

const initialAccountVotedState = {
  accountVoted: false,
};

export const accountVotedReducer = (
  state = initialAccountVotedState,
  action = {}
) => {
  switch (action.type) {
    case SET_ACCOUNT_VOTED:
      return { ...state, accountVoted: action.payload };

    default:
      return state;
  }
};

const initialTopCharactersState = {
  topCharacters: [],
};

export const setTopCharactersReducer = (
  state = initialTopCharactersState,
  action = {}
) => {
  switch (action.type) {
    case SET_TOP_CHARACTERS:
      return { ...state, topCharacters: action.payload };

    default:
      return state;
  }
};
