import Status from "../Status.js";
import nextTurn from "./nextTurn.js";
import { SELL_ANIMAL, START_OFFER } from "../../common/signals.js";

export default class Offer extends Status {
    playerId;
    targetId;
    animalId;
    count;
    offer;
    #twice = false;

    constructor(room, targetId, animalId, offer) {
        super(room);
        this.playerId = room.status.playerId;
        this.targetId = targetId;
        this.animalId = animalId;
        this.offer = offer;

        const player = room.players[this.playerId];
        const target = room.players[targetId];
        if (player.animals[animalId] === 2 && target.animals[animalId] === 2) {
            this.count = 2;
        } else {
            this.count = 1;
        }

        this.room.emit(START_OFFER, targetId, animalId, this.count, offer.length);
    }

    onCounter(target, offer) {
        if (target.id === this.targetId && target.has(offer)) {
            const player = this.room.players[this.playerId];
            const playerSum = this.offer.reduce((a, b) => a + b, 0);
            const targetSum = offer.reduce((a, b) => a + b, 0);

            // In case of equality, restart the offer (but only once, else the offering player wins)
            if (!this.#twice && playerSum === targetSum) {
                this.#twice = true;
                // TODO: restart offer
            }

            // Exchange capitals
            player.pay(this.offer);
            target.pay(offer);
            player.earn(offer);
            target.earn(this.offer);

            // The player who made the biggest offer gets the animals
            let buyer, seller, change;
            if (playerSum >= targetSum) {
                buyer = player;
                seller = target;
                change = this.offer.length - offer.length;
            } else {
                buyer = target;
                seller = player;
                change = offer.length - this.offer.length;
            }

            buyer.animals[this.animalId] += this.count;
            seller.animals[this.animalId] -= this.count;
            this.room.emit(SELL_ANIMAL, seller.id, buyer.id, this.animalId, this.count, change);

            this.room.status = nextTurn(this.room);
        }
    }

    serialize() {
        return {
            type: "offer",
            playerId: this.playerId,
            targetId: this.targetId,
            animalId: this.animalId,
            count: this.count,
            change: this.offer.length
        };
    }
}
