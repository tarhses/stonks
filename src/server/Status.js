import { FULL_ERROR } from "../common/signals.js";

export default class Status {
    room;

    constructor(room) {
        this.room = room;
    }

    onEnter(socket, playerName) {
        // Only admit reconnections
        const player = this.room.findPlayer(playerName);
        if (!player || player.connected) {
            return FULL_ERROR;
        }

        player.connect(socket);
        return this.room.serialize(player.id);
    }

    onLeave(player) {
        // Leave a chance to reconnect
        player.disconnect();
    }

    onStart() {}

    onSell() {}

    onBid() {}

    onStop() {}

    onDeal() {}

    onBuy() {}

    onOffer() {}

    onCounter() {}
}
