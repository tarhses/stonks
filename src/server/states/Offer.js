import Status from "../Status.js";
import nextTurn from "./transitions/nextTurn.js";
import { MAKE_OFFER, OFFER_STATE, RESTART_OFFER, SELL_ANIMAL } from "../../common/signals.js";

export default class Offer extends Status {
    playerId;
    targetId;
    animalId;
    count;
    offer = null;
    twice = false;

    constructor(room, playerId, targetId, animalId) {
        super(room);
        this.playerId = playerId;
        this.targetId = targetId;
        this.animalId = animalId;

        const player = room.players[playerId];
        const target = room.players[targetId];
        if (player.animals[animalId] === 2 && target.animals[animalId] === 2) {
            this.count = 2;
        } else {
            this.count = 1;
        }
    }

    onOffer(player, offer) {
        if (player.id === this.playerId && !this.offer && player.has(offer)) {
            this.offer = offer;
            player.emit(MAKE_OFFER, offer);
            player.broadcast(MAKE_OFFER, offer.length);
        }
    }

    onCounter(target, counteroffer) {
        if (target.id === this.targetId && this.offer && target.has(counteroffer)) {
            const player = this.room.players[this.playerId];
            const playerSum = this.offer.reduce((a, b) => a + b, 0);
            const targetSum = counteroffer.reduce((a, b) => a + b, 0);

            if (!this.twice && playerSum === targetSum) {
                // In case of equality, restart the offer
                // It can only occurs once, else the offering player wins anyway
                this.offer = null;
                this.twice = true;
                this.room.emit(RESTART_OFFER);
            } else {
                // The player who made the biggest offer wins
                let buyer, seller, change;
                if (playerSum >= targetSum) {
                    buyer = player;
                    seller = target;
                    change = this.offer.length - counteroffer.length;
                } else {
                    buyer = target;
                    seller = player;
                    change = counteroffer.length - this.offer.length;
                }

                buyer.animals[this.animalId] += this.count;
                seller.animals[this.animalId] -= this.count;
                this.room.emit(SELL_ANIMAL, seller.id, buyer.id, this.animalId, this.count, change);

                // Exchange capitals
                player.pay(this.offer);
                target.pay(counteroffer);
                player.earn(counteroffer);
                target.earn(this.offer);

                // Start next turn
                this.room.status = nextTurn(this);
            }
        }
    }

    serialize(selfId) {
        return {
            type: OFFER_STATE,
            playerId: this.playerId,
            targetId: this.targetId,
            animalId: this.animalId,
            count: this.count,
            offer: this.offer && selfId !== this.playerId ? this.offer.length : this.offer,
            twice: this.twice
        };
    }

    static deserialize(room, { playerId, targetId, animalId, offer, twice }) {
        const status = new Offer(room, playerId, targetId, animalId);
        status.offer = offer;
        status.twice = twice;

        return status;
    }
}
