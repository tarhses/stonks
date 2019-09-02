import Status from "../Status.js";
import AuctionEnd from "./AuctionEnd.js";
import nextTurn from "./nextTurn.js";
import rules from "../../common/rules.json";
import { MAKE_BID, RESTART_AUCTION, SELL_ANIMAL, START_AUCTION } from "../../common/signals.js";

export default class Auction extends Status {
    playerId;
    bidderId;
    animalId;
    timeout;
    amount = 0;
    #bidders;
    #timeoutId;

    constructor(room, restart) {
        super(room);
        this.playerId = this.bidderId = room.status.playerId;
        this.animalId = restart ? room.status.animalId : room.pickAnimal();
        this.timeout = this.startTimeout(rules.auctionTimeout);

        this.#bidders = new Set(room.players.keys());
        this.#bidders.delete(this.playerId); // the current player can't make bids

        if (restart) {
            // A player couldn't afford a bid, we'll reveal his capital and restart the auction
            room.emit(RESTART_AUCTION, room.players[room.status.bidderId].capital, this.timeout);
        } else {
            room.emit(START_AUCTION, this.animalId, this.timeout);
        }
    }

    stopAuction() {
        // Ensure we won't execute this method twice in a row
        clearTimeout(this.#timeoutId);

        if (this.playerId !== this.bidderId) {
            this.room.status = new AuctionEnd(this.room);
        } else {
            // Nobody made a bid, the player gets the animal for free
            const player = this.room.players[this.playerId];
            player.animals[this.animalId]++;
            this.room.emit(SELL_ANIMAL, player.id, player.id, this.animalId, 0, 0); // sell to himself

            // There's no need to go to the AuctionEnd state
            this.room.status = nextTurn(this.room);
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
            this.bidderId = bidder.id;
            this.amount = amount;
            this.timeout = this.startTimeout(rules.bidTimeout);
            this.room.emit(MAKE_BID, this.bidderId, this.amount, this.timeout);

            // Put the new highest bidder back in the game if he previously stopped
            this.#bidders.add(bidder.id);
        }
    }

    onStop(bidder) {
        if (bidder.id !== this.bidderId) {
            // The highest bidder can't stop
            // If he is the only remaining bidder, he wins the auction
            this.#bidders.delete(bidder.id);
            if (this.#bidders.size === 1 && this.#bidders.has(this.bidderId)) {
                this.stopAuction();
            }
        }
    }

    serialize() {
        return {
            type: "auction",
            playerId: this.playerId,
            bidderId: this.bidderId,
            animalId: this.animalId,
            amount: this.amount,
            timeout: this.timeout
        };
    }
}
