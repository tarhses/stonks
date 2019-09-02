import Status from "../Status.js";
import Auction from "./Auction.js";
import Offer from "./Offer.js";
import { START_TURN } from "../../common/signals.js";

export default class Turn extends Status {
    playerId;
    animalsLeft;

    constructor(room, playerId) {
        super(room);
        this.playerId = playerId;
        this.animalsLeft = room.animalCount > 0;

        room.emit(START_TURN, this.playerId, this.animalsLeft);
    }

    onSell(player) {
        if (player.id === this.playerId && this.animalsLeft) {
            this.room.status = new Auction(this.room);
        }
    }

    onBuy(player, targetId, animalId, capital) {
        const target = this.room.players[targetId];
        if (player.id === this.playerId &&
            player.id !== targetId &&
            player.animals[animalId] > 0 &&
            target.animals[animalId] > 0 &&
            player.has(capital)) {

            this.room.status = new Offer(this.room, targetId, animalId, capital);
        }
    }

    serialize() {
        return {
            type: "turn",
            playerId: this.playerId,
            animalsLeft: this.animalsLeft
        };
    }
}
