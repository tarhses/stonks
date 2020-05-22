import Status from "../Status.js";
import startAuction from "./transitions/startAuction.js";
import startOffer from "./transitions/startOffer.js";
import { TURN_STATE } from "../../common/signals.js";

export default class Turn extends Status {
    playerId;

    constructor(room, playerId) {
        super(room);
        this.playerId = playerId;
    }

    onSell(player) {
        if (player.id === this.playerId && this.room.animalCount > 0) {
            this.room.status = startAuction(this);
        }
    }

    onBuy(player, targetId, animalId) {
        const target = this.room.players[targetId];
        if (player.id === this.playerId && player.id !== targetId && player.animals[animalId] > 0 && target.animals[animalId] > 0) {
            this.room.status = startOffer(this, targetId, animalId);
        }
    }

    serialize() {
        return {
            type: TURN_STATE,
            playerId: this.playerId
        };
    }

    static deserialize(room, { playerId }) {
        return new Turn(room, playerId);
    }
}
