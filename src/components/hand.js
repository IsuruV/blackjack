import React, { Component, PropTypes } from 'react';
import Card from './card';

/**
 * Hand component where dealt cards are rendered.
 *
 * @class      Hand (name)
 * @param      {Object}       props             Component properties
 * @param      {Array}        props.cards       The cards
 * @param      {Integer}      props.score       The score
 * @param      {Bool}         props.inProgress  Is game in progress
 * @param      {String}       props.owner       Hand's owner (player or dealer)
 * @return     {ReactElement} markup
 */
class Hand extends Component {
    constructor(props) {
        super(props);

        /**
         * @type {object}
         * @property {Bool} isDealing
         */
        this.state = {
            isDealing: false,
        }
    }

    /**
     * Calculate and change `isDealing` state depending on
     * the received props.
     *
     */
    componentWillReceiveProps(nextProps) {
        const nextIsDealing = (nextProps.cards.length <= 2) && nextProps.inProgress;
        if (this.state.isDealing !== nextIsDealing) {
            this.setState({
                isDealing: nextIsDealing,
            })
        }
    }

    /**
     * Render conditionally score element.
     *
     * @param      {undefined|Integer}  score   The hand's score
     * @return     {ReactElement}        markup
     */
    renderScore(score) {
        return (
            score && <span className="score-value">{score}</span>
        )
    }

    render() {
        const { score, cards, owner } = this.props;
        const { isDealing } = this.state;

        return (
            <div id={owner} className="hand" data-dealing={isDealing}>
                <div className="score">
                        {this.renderScore(score)}
                </div>
                <div className="cards">
                        {cards.map((card, i) =>
                            <Card
                                img={card.img}
                                rank={card.rank}
                                suit={card.suit}
                                isPrivate={card.rank === 'dummy'}
                                key={i}
                            />
                        )}
                </div>
            </div>
        );
    }
}



export default Hand;
