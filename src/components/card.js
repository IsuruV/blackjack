import React, { PropTypes } from 'react';
import './card.css';
 /**
  * Card component.
  *
  * @class      Info (name)
  * @param      {Object}          props             Component properties
  * @param      {String|Integer}  props.rank        Card's rank
  * @param      {String}          props.suit        Card's suit
  * @param      {Bool}            props.isPrivate   Should rank & suit be rendered
  * @return     {ReactElement}    markup
  */
const Card = ({ rank, suit, img, isPrivate }) => {
    /**
     * Renders the top and bottom container
     * element. Keeps markup DRY.
     *
     * @return     {ReactElement}    markup
     */
    const renderContainer = () => {
        return (
            <div className="container">
            <img src={img}/>
                <span className="rank">Rank: {rank} </span>
                <span className="suit">Suit: {suit}</span>
            </div>
        );
    }

    /**
     * Renders the front of the card.
     *
     * @return     {ReactElement}    markup
     */
    const renderFront = () => {
        return (
            <div className="front">
                <div className="section top">
                    {renderContainer()}
                </div>
            </div>
        );
    }

    return (
        <div className={`card ${suit}`} data-private={isPrivate}>
            {!isPrivate ? renderFront() : <div>Hidden Card</div>}
            <div className="back"></div>
        </div>
    );
}

export default Card;
