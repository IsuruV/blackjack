import React, { PropTypes } from 'react';

/**
 * Control component
 *
 * Renders:
 * deal button
 * hit button
 * stand button
 *
 * @return {ReactElement} markup
 */


/**
 * Control component where player controls how to play the game.
 *
 * @class      Controls (name)
 * @param      {Object}       props               Component properties
 * @param      {Bool}         props.inProgress    Is game in progress
 * @param      {Bool}         props.gameOver      Are game's results shown
 * @param      {Function}     props.deal          Run when Deal button is clicked
 * @param      {Function}     props.hit           Run when Hit button is clicked
 * @param      {Function}     props.stand         Run when Stand button is clicked
 * @return     {ReactElement} markup
 */
const Controls = ({ inProgress, gameOver, deal, hit, stand }) => {
    return (
        <div className="controls">
                { !inProgress && !gameOver &&
                    <div className="button-container">
                        <button className="deal" onClick={deal}>
                            <i className="icon-right"></i>
                            <span>Deal</span>
                        </button>
                    </div>
                }

                {/*
                  * Show game buttons when the game is in progress or
                  * the game is over (displaying results) - in that case,
                  * disable them
                  */}
                { (inProgress || (!inProgress && gameOver)) &&
                    <div className="button-container">
                        <button className="hit" onClick={hit} disabled={gameOver}>
                            <i className="icon-right"></i>
                            <span>Hit</span>
                        </button>
                        <button className="stand" onClick={stand} disabled={gameOver}>
                            <i className="icon-down"></i>
                            <span>Stand</span>
                        </button>
                    </div>
                }
        </div>
    );
}


export default Controls;
