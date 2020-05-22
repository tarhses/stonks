import Status from "../Status.js";
import nextTurn from "./transitions/nextTurn.js";
import endAuction from "./transitions/endAuction.js";
import rules from "../../common/rules.json";
import { AUCTION_STATE, MAKE_BID, SELL_ANIMAL, SET_TIMER } from "../../common/signals.js";

export default class Auction extends Status {
    playerId;
    bidderId;
    animalId;
    amount = 0;
    bidders;
    timeout;
    #timeoutId;

    constructor(room, playerId, animalId) {
        super(room);
        this.playerId = playerId;
        this.bidderId = playerId;
        this.animalId = animalId;

        this.bidders = new Set(room.players.keys());
        this.bidders.delete(playerId); // the selling player can't make bids

        this.timeout = this.startTimeout(rules.auctionTimeout);
    }

    stopAuction() {
        // Ensure we won't execute this method twice in a row
        clearTimeout(this.#timeoutId);

        if (this.playerId !== this.bidderId) {
            this.room.status = endAuction(this);
        } else {
            // Nobody made a bid, the player gets the animal for free
            const player = this.room.players[this.playerId];
            player.animals[this.animalId]++;
            this.room.emit(SELL_ANIMAL, player.id, player.id, this.animalId, 0, 0); // sell to himself

            this.room.status = nextTurn(this);
        }
    }

    startTimeout(delay) {
        delay *= 1000; // seconds to milliseconds

        clearTimeout(this.#timeoutId);
        this.#timeoutId = setTimeout(() => this.stopAuction(), delay);

        return Date.now() + delay;
    }

    onBid(bidder, amount) {
        if (bidder.id !== this.playerId && amount > this.amount) {
            if (bidder.id !== this.bidderId) {
                this.bidders.add(bidder.id); // put the bidder back in the game if he previously stopped
                this.timeout = this.startTimeout(rules.bidTimeout);
            }

            this.bidderId = bidder.id;
            this.amount = amount;

            this.room.emit(MAKE_BID, this.bidderId, this.amount, this.timeout);
        }
    }

    onStop(bidder) {
        if (bidder.id !== this.bidderId) {
            // The highest bidder can't stop
            // If he is the only remaining bidder, he wins the auction
            this.bidders.delete(bidder.id);
            if (this.bidders.size === 0 || (this.bidders.size === 1 && this.bidders.has(this.bidderId))) {
                this.timeout = this.startTimeout(rules.stopTimeout);
                this.room.emit(SET_TIMER, this.timeout);
            }
        }
    }

    serialize(selfId) {
        return {
            type: AUCTION_STATE,
            playerId: this.playerId,
            bidderId: this.bidderId,
            animalId: this.animalId,
            amount: this.amount,
            bidding: this.bidders.has(selfId),
            timeout: this.timeout
        };
    }

    static deserialize(room, { playerId, bidderId, animalId, amount, bidders }) {
        const status = new Auction(room, playerId, animalId);
        status.bidderId = bidderId;
        status.amount = amount;
        status.bidders = new Set(bidders);

        // The timer is intentionally restarted
        return status;
    }
}
