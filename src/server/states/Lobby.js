import Status from "../Status.js";
import Turn from "./Turn.js";

export default class Lobby extends Status {
    constructor(room) {
        super(room);
    }

    onEnter(socket, playerName) {
        if (this.room.playerCount === 5) {
            return "This room is already full.";
        } else if (this.room.findPlayer(playerName) || /\s/.test(playerName)) {
            return "Please choose another name.";
        }

        const player = this.room.addPlayer(playerName);
        player.connect(socket);

        this.room.emit("enter", playerName);
        return this.room.serialize(player.id);
    }

    onLeave(player) {
        // Completely remove the player from the room
        this.room.emit("leave", player.id);
        this.room.removePlayer(player.id);
    }

    onStart() {
        if (this.room.playerCount >= 3) {
            this.room.status = new Turn(this.room, this.room.pickPlayer());
        }
    }

    serialize() {
        return null;
    }
}
