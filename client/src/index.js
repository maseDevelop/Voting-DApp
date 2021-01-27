import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import {createStore, combineReducers,applyMiddleware} from 'redux';
import {setUpReducer,characterDataReducer,accountVotedReducer,setTopCharactersReducer} from '../src/Reducers/reducers';
import {createLogger} from 'redux-logger';

//Need an Initial State

const logger = createLogger();
const rootReducer = combineReducers({setUpReducer,characterDataReducer,accountVotedReducer,setTopCharactersReducer});

//----> CreateStore(rootReducer,Initalstate)
const store = createStore(rootReducer,applyMiddleware(logger));

ReactDOM.render(
  <Provider store={store}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
