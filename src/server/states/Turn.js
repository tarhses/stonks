import Status from "../Status.js";
import Auction from "./Auction.js";
import Offer from "./Offer.js";
import { START_TURN } from "../../common/signals.js";

export default class Turn extends Status {
    playerId;

    constructor(room, playerId) {
        super(room);
        this.playerId = playerId;

        room.emit(START_TURN, this.playerId);
    }

    onSell(player) {
        if (player.id === this.playerId && this.room.animalCount > 0) {
            this.room.status = new Auction(this.room);
        }
    }

    onBuy(player, targetId, animalId) {
        const target = this.room.players[targetId];
        if (player.id === this.playerId && player.id !== targetId && player.animals[animalId] > 0 && target.animals[animalId] > 0) {
            this.room.status = new Offer(this.room, targetId, animalId);
        }
    }

    serialize() {
        return {
            type: "turn",
            playerId: this.playerId
        };
    }
}
