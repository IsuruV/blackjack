import React, { Component, PropTypes } from 'react';
import Info from './info';
import Hand from './hand';
import Controls from './controls';
import { calculateWinPercentage } from '../game';
import axios from 'axios';
const API = 'https://deckofcardsapi.com/api'
const RESET_ROUND_TIME = 2000;

 /**
  * Entry point for the view layer of the app
  *
  * Renders:
  * Info component
  * Hand (dealer) component
  * Hand (player) component
  * Control component (buttons)
  *
  * @return {ReactElement} markup
  */
class App extends Component {
    /**
     * Constructor
     *
     * @param      {object}    props                Component properties
     * @param      {object}    props.deck           Deck instance
     * @param      {object}    props.playerHand     Hand instance
     * @param      {object}    props.dealerHand     Hand instance
     * @param      {function}  props.getWinner      Decides the winner
     * @param      {function}  props.dealerDrawing  Dealer's AI
     *
     */
    constructor(props) {
        super(props);

        /**
         * @type {object}
         * @property {Integer} winCount
         * @property {Integer} roundCount
         * @property {Bool} inProgress
         * @property {Array} playerHand
         * @property {Array} dealerHand
         * @property {Bool|String} winPercentage
         * @property {Bool} isWin
         */
        this.state = {
            winCount: 0,
            roundCount: 0,
            inProgress: false,
            playerHand: [],
            dealerHand: [],
            winPercentage: false,
            isWin: undefined,
            deck_id: "",
            remaining: 0
        };
    }

    async componentDidMount(){
      await this.create();
    }

    /**
     * Create the deck of cards and shuffle
     */
    async create() {
      axios.get(`${API}/deck/new/shuffle/?deck_count=6`).then(response => {
          const { deck_id, remaining } = response.data;
          this.setState({deck_id, remaining});
      })
    }

    async deal() {
        const DRAW_CARD = `${API}/deck/${this.state.deck_id}/draw/?count=1`
        let data = await axios.get(DRAW_CARD);
        let card = data.data.cards[0];
        const rank = card.value;
        const suit = card.suit;
        const img = card.image;
         return { rank, suit, img };
    }

    /**
     * Handle deal new cards event (new round).
     * Deals cards to player and dealer.
     * Sets application state to update the app view.
     */
    async onDeal() {
        let { deck, playerHand, dealerHand } = this.props;
        const { roundCount } = this.state;

        // clear timeout in case the
        // deal button is pressed before
        // the game was reset
        this.clearTimeout();
        this.resetRound();

        // deal cards
        let draw1 = await this.deal();
        playerHand.draw(draw1);
        let draw2 = await this.deal();
        dealerHand.draw(draw2);
        let draw3 = await this.deal();
        playerHand.draw(draw3);
        // second card to dealer
        // remains in the hand instance
        // but not in the view until
        // the player stands
        let draw4 = await this.deal();
        dealerHand.draw(draw4);

        // set state to update the view
        this.setState((prevState, props) => ({
            playerHand: playerHand.cards,
            // first card and second dummy card
            // for dealer's hand view
            dealerHand: [dealerHand.cards[0], {rank: 'dummy',  suit: ''}],
            playerScore: playerHand.scoreTotal,
            roundCount: ++prevState.roundCount,
            inProgress: true,
        }), () => {
            // automatically stand if blackjack is drawn!
            return playerHand.hasBlackjack ? this.onStand() : null;
        });

    }

    /**
     * Handle player's new hit event.
     */
    async onHit() {
        let { deck, playerHand } = this.props;

        // draw one card
        let deal = await this.deal();
        playerHand.draw(deal);

        // update the view
        this.setState({
            playerHand: playerHand.cards,
            playerScore: playerHand.scoreTotal,
        }, () => {
            // automatically stand if bust
            return playerHand.isBust ? this.onStand() : null;
        });

    }

    /**
     * Handles player's stand event (round finished).
     * Dealers hits here - view layer does not know
     * anything about the logic.
     * Determines the winner
     * Updates the view
     */
    async onStand() {
        const { playerHand, deck, getWinner, dealerDrawing } = this.props;
        let { dealerHand } = this.props;

        // let dealer draw
        let draw = await this.deal();

        dealerDrawing(dealerHand, draw, playerHand);

        // prepare state to be updated
        const dealerScore = dealerHand.scoreTotal;
        const isWin = getWinner(playerHand.scoreTotal, dealerScore);
        const winCount = isWin === true ? ++this.state.winCount : this.state.winCount;
        const winPercentage = calculateWinPercentage(winCount, this.state.roundCount);

        this.setState((prevState, props) => ({
            winCount,
            winPercentage,
            dealerHand: dealerHand.cards,
            dealerScore,
            inProgress: false,
            isWin,
        }), () => {
            // hide cards and prepare for the next round
            this.timeout = window.setTimeout(() => {
                this.resetRound();
            }, RESET_ROUND_TIME);
        });
    }

    resetRound() {
        const { playerHand, dealerHand } = this.props;

        // clear hands
        playerHand.clear();
        dealerHand.clear();

        // clean-up the view
        this.setState({
            isWin: undefined,
            playerHand: [],
            dealerHand: [],
            playerScore: undefined,
            dealerScore: undefined,
        });
    }

    /**
     * Clear timeout if defined
     */
    clearTimeout() {
        if (this.timeout) {
            window.clearTimeout(this.timeout);
        }
    }

    /**
     * Clear timeout when component unmounts.
     * This is not necessary for this app because
     * this component will only umnount when the
     * browser tab/window is closed, but still
     * it is good to clean-up
     */
    componentWillUnmount() {
        this.clearTimeout();
    }


    /**
     * Render the app component.
     * @return {ReactElement} markup
     */
    render() {
        const {
            roundCount,
            playerHand,
            playerScore,
            dealerScore,
            dealerHand,
            inProgress,
            isWin,
            winCount,
            winPercentage,
        } = this.state;

        return (
            <div className="app">
                <header>
                    <Info isWin={isWin} winPercentage={winPercentage} />
                </header>
                <section role="main">
                    <Hand cards={dealerHand} score={dealerScore} inProgress={inProgress} owner="dealer" />
                    <Hand cards={playerHand} score={playerScore} inProgress={inProgress} owner="player" />
                </section>
                <footer>
                    <nav>
                        <Controls
                            inProgress={inProgress}
                            gameOver={isWin !== undefined}
                            deal={() => this.onDeal()}
                            hit={() => this.onHit()}
                            stand={() => this.onStand()}
                        />
                    </nav>
                </footer>
            </div>
        );
    }
}

export default App;
