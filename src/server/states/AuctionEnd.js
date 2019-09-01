import Status from "../Status.js";
import Auction from "./Auction.js";
import nextTurn from "./nextTurn.js";

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

        this.room.emit("stop");
    }

    sell(seller, buyer) {
        const payment = buyer.findMinimalPayment(this.amount);
        if (payment) {
            buyer.pay(payment);
            seller.earn(payment);

            buyer.animals[this.animalId]++;
            this.room.emit("sell", seller.id, buyer.id, this.animalId, 0, payment.length);

            this.room.status = nextTurn(this.room);
        } else {
            // Not enough money, restart the auction
            this.room.status = new Auction(this.room, true);
        }
    }

    onDeal(player) {
        if (player.id === this.playerId) {
            this.sell(player, this.room.players[this.bidderId]);
        }
    }

    onBuyback(player) {
        if (player.id === this.playerId) {
            this.sell(this.room.players[this.bidderId], player);
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
