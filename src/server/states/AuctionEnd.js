import Status from "../Status.js";
import nextTurn from "./transitions/nextTurn.js";
import restartAuction from "./transitions/restartAuction.js";
import { SELL_ANIMAL } from "../../common/signals.js";

export default class AuctionEnd extends Status {
    playerId;
    bidderId;
    animalId;
    amount;

    constructor(room, playerId, bidderId, animalId, amount) {
        super(room);
        this.playerId = playerId;
        this.bidderId = bidderId;
        this.animalId = animalId;
        this.amount = amount;
    }

    sell(seller, buyer) {
        const payment = buyer.findMinimalPayment(this.amount);
        if (payment) {
            buyer.animals[this.animalId]++;
            this.room.emit(SELL_ANIMAL, seller.id, buyer.id, this.animalId, 0, payment.length);

            buyer.pay(payment);
            seller.earn(payment);

            this.room.status = nextTurn(this);
        } else {
            // Not enough money, restart the auction
            this.room.status = restartAuction(this);
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
