import Status from "../Status.js";
import Auction from "./Auction.js";
import nextTurn from "./nextTurn.js";
import { END_AUCTION, SELL_ANIMAL } from "../../common/signals.js";

export default class AuctionEnd extends Status {
    playerId;
    bidderId;
    animalId;
    amount;

    constructor(room) {
        super(room);
        this.playerId = room.status.playerId;
        this.bidderId = room.status.bidderId;
        this.animalId = room.status.animalId;
        this.amount = room.status.amount;

        this.room.emit(END_AUCTION);
    }

    sell(seller, buyer) {
        const payment = buyer.findMinimalPayment(this.amount);
        if (payment) {
            buyer.animals[this.animalId]++;
            this.room.emit(SELL_ANIMAL, seller.id, buyer.id, this.animalId, 0, payment.length);

            buyer.pay(payment);
            seller.earn(payment);

            this.room.status = nextTurn(this.room);
        } else {
            // Not enough money, restart the auction
            this.room.status = new Auction(this.room, true);
        }
    }

    onDeal(player, buyback) {
        if (player.id === this.playerId) {
            const bidder = this.room.players[this.bidderId];
            if (buyback) {
                this.sell(bidder, player);
            } else {
                this.sell(player, bidder);
            }
        }
    }

    serialize() {
        return {
            type: "auctionEnd",
            playerId: this.playerId,
            bidderId: this.bidderId,
            animalId: this.animalId,
            amount: this.amount
        };
    }
}
