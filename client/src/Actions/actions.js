import {

    SET_WEB3_INSTANCE,
    SET_ACCOUNTS_INSTANCE,
    SET_CONTRACT_INSTANCE,
    STORE_CHARACTER_DATA,
    STORE_CHARACTER_SEARCH_RESULTS,
    SET_ACCOUNT_VOTED,
    SET_TOP_CHARACTERS,
    SET_IS_LOADING
} from '../Constants'

export const setWeb3Instance = (value) => ({
    type: SET_WEB3_INSTANCE,
    payload: value,
});

export const setAccountsInstance = (value) => ({
    type: SET_ACCOUNTS_INSTANCE,
    payload: value,
});

export const setContractInstance = (value) => ({
    type: SET_CONTRACT_INSTANCE,
    payload: value,
});

export const storeCharacterData = (data) => ({
    type: STORE_CHARACTER_DATA,
    payload: data,
});

export const storeCharacterSearchResults = (data) => ({
    type: STORE_CHARACTER_SEARCH_RESULTS,
    payload: data,
});

export const setAccountHasVoted = (bool) => ({
    type: SET_ACCOUNT_VOTED,
    payload: bool,
});

export const setTopCharacters = (data) => ({
    type: SET_TOP_CHARACTERS,
    payload: data,
});

export const setLoading = (bool) =>({
    type: SET_IS_LOADING,
    payload: bool
});







