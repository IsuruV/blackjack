import React from 'react';
import ReactDOM  from 'react-dom';
import './index.css';
import App from './components/app';
// import game classes
import Hand from './game/hand';
// import game logic
import { getWinner, dealerDrawing } from './game';

// create instances of game classes
const dealerHand = new Hand();
const playerHand = new Hand();

/**
 * Renders the app into the DOM.
 * `#root` is the mounting point.
 */
ReactDOM.render(
    // and pass them all to the app component
    <App
        dealerHand={dealerHand}
        playerHand={playerHand}
        getWinner={getWinner}
        dealerDrawing={dealerDrawing}
    />,
    document.getElementById('root')
);
